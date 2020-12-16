/**
 * test suite for the GeneralService module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const service = require('../src/services/GeneralService.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');

const suite = function() {
    let student2;

    before(function(done) {
        done();
    });

    beforeEach(function(done) {
        done();
    });

    const reset = (done) => {
        student2 = new Student(2, 'Giovanni', 'Storti', 'tjw85.student.storti@inbox.testmail.app', 'giovanni');

        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    };

    describe('GeneralService', function() {        
        describe('userLogin', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should accept the request', function(done) {
                service.userLogin(student2.email, student2.password)
                    .then((user) => {
                        assert.strictEqual(user.userId, student2.studentId, 'different user retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('incorrect username should discard the request', function(done) {
                service.userLogin('franco@agg.it', student2.password)
                    .then((user) => {
                        done('This should fail');
                    })
                    .catch((err) => done()); // correct case
            });

            it('incorrect password should discard the request', function(done) {
                service.userLogin(student2.email, 'franco')
                    .then((user) => {
                        done('This should fail');
                    })
                    .catch((err) => done()); // correct case
            });
        })
    });
}
module.exports = suite;