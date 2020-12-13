/**
 * test suite for the ManagerService module
 * @author Appendini Lorenzo
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
        student2 = new Student(2, 'Giovanni', 'Storti', 'giovanni.storti@agg.it', 'giovanni');

        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    };

    describe('ManagerService', function() {   
    });
}
module.exports = suite;