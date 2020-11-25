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
    before(function(done) {
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
                done();
            });
            
            it('incorrect username should discard the request', function(done) {
                done();
            });

            it('incorrect password should discard the request', function(done) {
                done();
            });
        })
    });
}
module.exports = suite;