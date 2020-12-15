/**
 * test suite for the ManagerService module
 * @author Appendini Lorenzo
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const service = require('../src/services/ManagerService.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');
const { italic } = require('colors');

const suite = function () {
    // let student2;

    before(function (done) {
        done();
    });

    beforeEach(function (done) {
        reset(done);
    });

    const reset = (done) => {
        // student2 = new Student(2, 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');

        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    };

    describe('ManagerService', function () {
        describe('managerGetStudent', function () {
            it('correct serialNumber should return a student', function (done) {
                service.managerGetStudent({ managerId: 1 }, { serialNumber: '1' })
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Student()), "student received.")
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('correct ssn should return a student', function (done) {
                service.managerGetStudent({ managerId: 1 }, { ssn: 'aldo1' })
                    .then((user) => {
                        assert.strictEqual(typeof (user), typeof (new Student()), "student received.")
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('correct serialNumber should not return a teacher', function (done) {
                service.managerGetStudent({ managerId: 1 }, { serialNumber: '4' })
                    .then((user) => {
                        done('No user should be returned');
                    })
                    .catch((err) => done()); //ok
            });

            it('non existing user should fail the request', function (done) {
                service.managerGetStudent({ managerId: 1 }, { ssn: 'invalid' })
                    .then((user) => {
                        done('No user should be returned');
                    })
                    .catch((err) => done()); //ok
            });

            it('no query should fail the request', function (done) {
                service.managerGetStudent({ managerId: 1 }, {})
                    .then((user) => {
                        done('No user should be returned');
                    })
                    .catch((err) => done()); //ok
            });


        });

        describe('managerGetReport', function () {
            it('correct params should return a list of users', function (done) {
                service.managerGetReport({ managerId: 1, serialNumber: 1 }, {})
                    .then((users) => {
                        assert.strictEqual(users.length, 2, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non existing student should return an empty list', function (done) {
                service.managerGetReport({ managerId: 1, serialNumber: -1 }, {})
                    .then((users) => {
                        assert.strictEqual(users.length, 0, 'Wrong number of users');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
}
module.exports = suite;