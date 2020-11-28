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
    let student2;
    let lecture1;
    let lecture2;
    let course5;

    before(function(done) {
        done();
    });

    beforeEach(function(done) {
        reset();
        done();
    });

    const reset = (done) => {
        student1 = new Student(1);
        student2 = new Student(2);
        lecture1 = new Lecture(1, 1);
        lecture2 = new Lecture(2, 2);
        course5 = new Course(5);

        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    }

    describe('StudentService', function() {
        beforeEach(function(done) {
            reset(done);
        });

        describe('studentBookLecture', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should accept the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture2.courseId, lecture2.lectureId)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'Unable to book a lecture');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('already booked lecture should refuse the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture1.courseId, lecture1.lectureId)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });
            
            it('not existing lecture should refuse the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture1.lectureId, -1)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });

            it('existing student is not enrolled in that course should refuse the booking request', function(done) {
                service.studentBookLecture(student2.studentId, lecture1.courseId, lecture1.lectureId)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });

            it('course and lecture mistmatch should refuse the booking request', function(done) {
                service.studentBookLecture(student1.studentId, lecture1.courseId, lecture2.lectureId)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });
        });

        describe('studentUnbookLecture', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should accept the unbooking request', function(done) {
                service.studentUnbookLecture(student1.studentId, lecture1.courseId, lecture1.lectureId)
                    .then((retVal) => {
                        assert.ok(retVal > 0, 'Unable to unbook a lecture');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('wrong params should refuse the unbooking request', function(done) {
                service.studentUnbookLecture(-1, lecture1.courseId, lecture1.lectureId)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });
        });

        describe('studentGetCourseLectures', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should return the list of lectures', function(done) {
                service.studentGetCourseLectures(student1.studentId, lecture1.courseId)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('student not enrolled should throw an error', function(done) {
                service.studentGetCourseLectures(student2.studentId, lecture1.courseId)
                    .then((retVal) => done('This should fail'))
                    .catch((err) => done());
            });

            it('course with no future lectures should return an empty list of lectures', function(done) {
                service.studentGetCourseLectures(student2.studentId, course5.courseId)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('studentGetCourses', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should return the list of courses the student is enrolled in', function(done) {
                service.studentGetCourses(student2.studentId)
                    .then((courses) => {
                        assert.strictEqual(courses.length, 1, 'Wrong number of courses retrieved');
                        done();
                    })
                    .catch((err) => done(err));

            });
            
            it('non-existing student should return an empty list of courses', function(done) {
                service.studentGetCourse(-1)
                    .then((courses) => {
                        assert.strictEqual(courses.length, 0, 'Wrong number of courses retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('studentGetBookings', function() {
            beforeEach(function(done) {
                reset(done);
            });

            it('correct params should return a list of lectures the student is booked for', function(done) {
                service.studentGetBookings(student2.studentId)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of bookings retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('non-existing student should return an empty list of lectures', function(done) {
                service.studentGetBookings(-1)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of bookings retrieved');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
}
module.exports = suite;