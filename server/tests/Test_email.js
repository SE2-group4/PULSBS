/**
 * Email Service tests
 */

const should = require('should');
const mockery = require('mockery');
const assert = require('assert');
const nodemailerMock = require('nodemailer-mock');
var EmailService;

const suite = function () {
    describe('EmailService', function () {
        describe('Tests EmailService.sendConfirmationBookingEmail', async () => {

            before(async () => {
                // Enable mockery to mock objects
                mockery.enable({
                    warnOnUnregistered: false,
                    useCleanCache: true,
                });
                mockery.registerMock('nodemailer', nodemailerMock);
                EmailService = require('../src/services/EmailService');

            });

            afterEach(async () => {
                nodemailerMock.mock.reset();
            });

            after(async () => {
                // Remove our mocked nodemailer and disable mockery
                mockery.deregisterAll();
                mockery.disable();
            });

            it('should send a confirmation booking email using nodemailer-mock', async () => {

                const response = EmailService.sendConfirmationBookingEmail("s3945734658376e@gmail.com", "SE2", "13:00"); // <-- your email code here
                response.then((done) => {
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });

            it('should fail to send a confirmation booking email using nodemailer-mock', async () => {
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

            it('should verify using the real nodemailer transport of sendConfirmationBookingEmail', async () => {
                // tell the mock class to pass verify requests to nodemailer
                nodemailerMock.mock.setMockedVerify(false);

                // call a service that uses nodemailer
                const response = EmailService.sendConfirmationBookingEmail("fakeStudent.se2@gmail.com", "SE2", "13:00"); // <-- your code here

                response.then((done) => {
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });
            it("should verify that the confirmation booking email cannot send because the to is a nullish value", async () => {
                const response = EmailService.sendConfirmationBookingEmail(null, "SE2", "13:00");
                response.catch((err) => {
                    // console.log(err);
                    err.should.be.exactly("Undefined recipient")
                    done();
                })
            });
        })
        describe('Tests EmailService.sendStudentNumberEmail', async () => {

            before(async () => {
                // Enable mockery to mock objects
                mockery.enable({
                    warnOnUnregistered: false,
                    useCleanCache: true,
                });
                mockery.registerMock('nodemailer', nodemailerMock);
                EmailService = require('../src/services/EmailService');

            });

            afterEach(async () => {
                nodemailerMock.mock.reset();
            });

            after(async () => {
                // Remove our mocked nodemailer and disable mockery
                mockery.deregisterAll();
                mockery.disable();
            });

            it('should send a number of student  email using nodemailer-mock', async () => {

                const response = EmailService.sendStudentNumberEmail("s3945734658376e@gmail.com", "SE2", "13:00", 3); // <-- your email code here
                response.then((done) => {
                    //console.log(done);
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });

            it('should fail to send an email using nodemailer-mock', async () => {
                // tell the mock class to return an error
                const err = new Error('My custom error');
                nodemailerMock.mock.setShouldFailOnce();
                nodemailerMock.mock.setFailResponse(err);

                // call a service that uses nodemailer
                const response = EmailService.sendStudentNumberEmail("fakeStudent.se2@gmail.com", "SE2", "13:00", 3); // <-- your code here

                // a test for our response
                response.then((done) => {
                    response.error.should.be.exactly(err);
                    done();
                })
            });

            it('should verify using the real nodemailer transport', async () => {
                // tell the mock class to pass verify requests to nodemailer
                nodemailerMock.mock.setMockedVerify(false);

                // call a service that uses nodemailer
                const response = EmailService.sendStudentNumberEmail("fakeStudent.se2@gmail.com", "SE2", "13:00", 3); // <-- your code here

                /* calls to transport.verify() will be passed through, 
                transport.sendMail() is still mocked */
                response.then((done) => {
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });
            it("should verify that the email cannot send because the to is a nullish value", async () => {
                const response = EmailService.sendStudentNumberEmail(null, "SE2", "13:00", 3); // <-- your code here
                response.catch((err) => {
                    // console.log(err);
                    err.should.be.exactly("Undefined recipient");
                    done();
                })
            });
        })
        describe('Tests EmailService.sendCustomEmail', async () => {

            before(async () => {
                // Enable mockery to mock objects
                mockery.enable({
                    warnOnUnregistered: false,
                    useCleanCache: true,
                });
                mockery.registerMock('nodemailer', nodemailerMock);
                EmailService = require('../src/services/EmailService');

            });

            afterEach(async () => {
                nodemailerMock.mock.reset();
            });

            after(async () => {
                // Remove our mocked nodemailer and disable mockery
                mockery.deregisterAll();
                mockery.disable();
            });

            it('should send a custom e-mail using nodemailer-mock', async () => {

                const response = EmailService.sendCustomMail("s3945734658376e@gmail.com", "Test", "This is a test"); // <-- your email code here
                response.then((done) => {
                    //console.log(done);
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });

            it('should fail to send a custom e-mail using nodemailer-mock', async () => {
                // tell the mock class to return an error
                const err = new Error('My custom error');
                nodemailerMock.mock.setShouldFailOnce();
                nodemailerMock.mock.setFailResponse(err);

                // call a service that uses nodemailer
                const response = EmailService.sendCustomMail("s3945734658376e@gmail.com", "Test", "This is a test"); // <-- your code here

                // a test for our response
                response.then((done) => {
                    response.error.should.be.exactly(err);
                    done();
                })
            });

            it('should verify using the real nodemailer transport', async () => {
                // tell the mock class to pass verify requests to nodemailer
                nodemailerMock.mock.setMockedVerify(false);

                // call a service that uses nodemailer
                const response = EmailService.sendCustomMail("s3945734658376e@gmail.com", "Test", "This is a test"); // <-- your code here

                /* calls to transport.verify() will be passed through, 
                transport.sendMail() is still mocked */
                response.then((done) => {
                    done.response.should.be.exactly("nodemailer-mock success");
                }).catch((err) => {
                    // console.log(err);
                    done(err);
                })
            });
            it("should verify that the custom email cannot send because 'to' is a nullish value", async () => {
                const response = EmailService.sendCustomMail("s3945734658376e@gmail.com", "Test", "This is a test"); // <-- your code here
                response.catch((err) => {
                    err.should.be.exactly("Undefined recipient")
                })
            });
        });
        describe('Tests EmailService.getDefaultEmail', async () => {
            it('default template does not have the property', async () => {
                let response = EmailService.getDefaultEmail("ThisIsNotAProperty")
                // console.log(response)
                assert.ok(Object.keys(response).length === 0 && response.constructor === Object)
            })
            it('return correct default email', async () => {
                let response = EmailService.getDefaultEmail("LESSON_CANCELLED", ["BestCourse"], ["00:00:00"]);
                // console.log(response)
                assert.ok(response.hasOwnProperty("subject") && response.hasOwnProperty("message"))
            })
        })
    });
}

module.exports = suite;