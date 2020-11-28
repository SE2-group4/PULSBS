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
        this.student2 = new Student(2, 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');
        
        done();
    });

    beforeEach(function(done) {
        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('GeneralService', function() {
        describe('userLogin', function() {
            it('correct params should accept the request', function(done) {
                service.userLogin(this.student2.email, this.student2.password)
                    .then((user) => {
                        assert.strictEqual(user.userId, this.student2.studentId, 'different user retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('incorrect username should discard the request', function(done) {
                service.userLogin('franco@agg.it', this.student2.password)
                    .then((user) => {
                        done('This should fail');
                    })
                    .catch((err) => done()); // correct case
            });

            it('incorrect password should discard the request', function(done) {
                service.userLogin(this.student2.email, 'franco')
                    .then((user) => {
                        done('This should fail');
                    })
                    .catch((err) => done()); // correct case
            });
        })
    });
}
module.exports = suite;