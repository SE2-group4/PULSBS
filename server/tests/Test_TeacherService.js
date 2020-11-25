/**
 * test suite for the TeacherService module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const service = require('../src/services/TeacherService.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');

const suite = function() {
    before(function(done) {
        dao.openConn('testing.db');

        done();
    });

    beforeEach(function(done) {
        prepare('testing.db', 'testing.sql', true)
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('TeacherService', function() {
        describe('teacherGetCourseLectureStudents', function() {
            it('correct params should return the list of students booked for the given lecture', function(done) {

            });

            /*
            it('the teacher do not teach that course should throw error', function(done) {

            });
            */

            it('course - lecture mismatch should return an empty list', function(done) {

            });

            it('lecture with no bookings should return an empty list', function(done) {

            });
        });

        describe('teacherGetCourseLectures', function() {
            it('correct params should return the list of future lectures', function(done) {

            });

            it('course - lecture mismatch should retrive an empty list', function(done) {

            });

            /*
            it('the teacher do not teach that course should throw error', function(done) {

            });
            */
        });

        describe('teacherGetCourses', function() {
            it('correct params should return a list of courses', function(done) {

            });
            
            it('non-existing teacher should returna an empty list', function(done) {

            });
        });

        describe('isCourseTeachedBy', function() {
            it('correct params should return a teacher', function(done) {

            });
            
            it('non-existing course should throw an error', function(done) {

            });
        });

        describe('doesLectureBelongCourse', function() {
            it('correct params should return a course', function(done) {

            });
            
            it('non-existing lecture should throw an error', function(done) {

            });
        });

        /*
        // NOT EXPORTED FUNCTIONS

        describe('nextCheck', function() {
            it('', function(done) {

            });
            
            it('', function(done) {

            });

        });

        describe('checkForExpiredLectures', function() {
            it('', function(done) {

            });
            
            it('', function(done) {

            });

        });
        */
    });
}
module.exports = suite;