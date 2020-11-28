/**
 * test suite for the StudentService module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const service = require('../src/services/StudentService.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');

const suite = function() {
    let student1;
    let lecture1;
    let lecture2;

    before(function(done) {
        student1 = new Student(1);
        lecture1 = new Lecture(1, 1);
        lecture2 = new Lecture(2, 2);

        done();
    });

    beforeEach(function(done) {
        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('StudentService', function() {
        describe('studentBookLecture', function() {
            it('correct params should accept the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture2.courseId, lecture2.lectureId)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'unable to book a lecture');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('already booked lecture should refuse the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture1.courseId, lecture1.lectureId)
                    .then((retVal) => {
                        done('This should fail');
                    })
                    .catch((err) => done());
            });
            
            it('not existing lecture should refuse the booking request', function(done) {
                done();
            });

            it('student is not enrolled in that course should refuse the booking request', function(done) {
                done();
            });

            it('course and lecture mistmatch should refuse the booking request', function(done) {
                done();
            });
        });

        describe('studentUnbookLecture', function() {
            it('correct params should accept the unbooking request', function(done) {
                done();
            });
            
            it('wrong params should refuse the unbooking request', function(done) {
                done();
            });
        });

        describe('studentGetCourseLectures', function() {
            it('correct params should return the list of lectures', function(done) {
                done();
            });
            
            it('student not enrolled should throw an error', function(done) {
                done();
            });

            it('course with no future lectures should return an empty list of lectures', function(done) {
                done();
            });
        });

        describe('studentGetCourses', function() {
            it('correct params should return the list of courses the student is enrolled in', function(done) {
                done();
            });
            
            it('non-existing student should return an empty list of courses', function(done) {
                done();
            });
        });

        describe('studentGetBookings', function() {
            it('correct params should return a list of lectures the student is booked for', function(done) {
                done();
            });
            
            it('non-existing student should return an empty list of lectures', function(done) {
                done();
            });
        });
    });
}
module.exports = suite;