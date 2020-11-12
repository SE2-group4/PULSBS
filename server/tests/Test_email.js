const should = require('should');
const mockery = require('mockery');
const assert = require('assert');
const nodemailerMock = require('nodemailer-mock');
const EmailService = require('../src/services/EmailService');

const suite = describe('Tests that send email', async () => {

    /* This could be an app, Express, etc. It should be 
    instantiated *after* nodemailer is mocked. */
    let app = null;

    before(async () => {
        // Enable mockery to mock objects
        mockery.enable({
            warnOnUnregistered: false,
        });

        /* Once mocked, any code that calls require('nodemailer') 
        will get our nodemailerMock */
        mockery.registerMock('nodemailer', nodemailerMock)

        /*
        ##################
        ### IMPORTANT! ###
        ##################
        */
        /* Make sure anything that uses nodemailer is loaded here, 
        after it is mocked just above... */


    });

    afterEach(async () => {
        // Reset the mock back to the defaults after each test
        nodemailerMock.mock.reset();
    });

    after(async () => {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should send an email using nodemailer-mock', async () => {
        // call a service that uses nodemailer
        const response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your email code here

        // a fake test for something on our response
        response.should.equal(true);

        // get the array of emails we sent
        const sentMail = nodemailerMock.mock.getSentMail();

        // we should have sent one email
        sentMail.length.should.be.exactly(1);

        // check the email for something
        sentMail[0].property.should.be.exactly('foobar');
    });

    it('should fail to send an email using nodemailer-mock', async () => {
        // tell the mock class to return an error
        const err = new Error('My custom error');
        nodemailerMock.mock.setShouldFailOnce();
        nodemailerMock.mock.setFailResponse(err);

        // call a service that uses nodemailer
        var response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

        // a fake test for something on our response
        response.error.should.be.exactly(err);
    });

    it('should verify using the real nodemailer transport', async () => {
        // tell the mock class to pass verify requests to nodemailer
        nodemailerMock.mock.setMockedVerify(false);

        // call a service that uses nodemailer
        var response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

        /* calls to transport.verify() will be passed through, 
           transport.sendMail() is still mocked */
    });
});

module.exports = suite;