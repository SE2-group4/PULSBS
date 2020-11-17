const should = require('should');
const mockery = require('mockery');
const assert = require('assert');
const nodemailerMock = require('nodemailer-mock');
var EmailService;

const suite = describe('Tests that send email', async () => {


    /* This could be an app, Express, etc. It should be 
    instantiated *after* nodemailer is mocked. */
    let app = null;

    before(async () => {

        // Enable mockery to mock objects
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true,
        });

        /* Once mocked, any code that calls require('nodemailer') 
        will get our nodemailerMock */
        mockery.registerMock('nodemailer', nodemailerMock);

        /*
        ##################
        ### IMPORTANT! ###
        ##################
        */
        /* Make sure anything that uses nodemailer is loaded here, 
        after it is mocked just above... */
        EmailService = require('../src/services/EmailService');

    });

    afterEach(async () => {
        // Reset the mock back to the defaults after each test
        nodemailerMock.mock.reset();
        //mockery.resetCache();
    });

    after(async () => {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should send an email using nodemailer-mock', async () => {

        const response = EmailService.sendConfirmationBookingEmail("s3945734658376e@gmail.com", "SE2", "13:00"); // <-- your email code here
        response.then((done) => {
            //console.log(done);
            done.response.should.be.exactly("nodemailer-mock success");
        }).catch((err) => {
            console.log(err);
        })
    });

    it('should fail to send an email using nodemailer-mock', async () => {
        // tell the mock class to return an error
        const err = new Error('My custom error');
        nodemailerMock.mock.setShouldFailOnce();
        nodemailerMock.mock.setFailResponse(err);

        // call a service that uses nodemailer
        const response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

        // a test for our response
        response.then((done) => {
            response.error.should.be.exactly(err);
        })
    });

    it('should verify using the real nodemailer transport', async () => {
        // tell the mock class to pass verify requests to nodemailer
        nodemailerMock.mock.setMockedVerify(false);

        // call a service that uses nodemailer
        const response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

        /* calls to transport.verify() will be passed through, 
           transport.sendMail() is still mocked */
        response.then((done) => {
            //console.log(done);
            done.response.should.be.exactly("nodemailer-mock success");
        }).catch((err) => {
            console.log(err);
        })
    });
});

const suite2 = describe('Tests that send real email', async () => {
    before(async () => {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should send real email without mock', async () => {
        const response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

        response.then((done) => {
            //console.log(done);
            done.response.should.be.exactly("nodemailer-mock success");
        }).catch((err) => {
            console.log(err);
        })
    })
});

module.exports = suite;