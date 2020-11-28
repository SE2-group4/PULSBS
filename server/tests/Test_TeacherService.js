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
    let teacher4;
    let teacher5;
    let lecture1;
    let lecture4;

    before(function(done) {
        teacher4 = new Teacher(4);
        teacher4 = new Teacher(5);
        lecture1 = new Lecture(1, 1);
        lecture4 = new Lecture(4, 1);

        done();
    });

    beforeEach(function(done) {
        prepare('testing.db', 'testing.sql', false)
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('TeacherService', function() {
        describe('teacherGetCourseLectureStudents', function() {
            it('correct params should return the list of students booked for the given lecture', function(done) {
                service.teacherGetCourseLectureStudents(this.teacher4.teacherId, this.lecture1.courseId, this.lecture1.lectureId)
                    .then((students) => {
                        assert.strictEqual(students.length, 1, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });

            /*
            it('the teacher do not teach that course should throw error', function(done)  {
                done();
            });
            */

            it('course - lecture mismatch should return an empty list', function(done) {
                service.teacherGetCourseLectureStudents(this.teacher4.teacherId, this.lecture1.courseId, -1)
                    .then((students) => {
                        assert.strictEqual(students.length, 0, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('lecture with no bookings should return an empty list', function(done) {
                service.teacherGetCourseLectureStudents(this.teacher4.teacherId, this.lecture4.courseId, this.lecture4.lectureId)
                    .then((students) => {
                        assert.strictEqual(students.length, 0, 'Wrong number of students');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('teacherGetCourseLectures', function() {
            it('correct params should return the list of future lectures', function(done) {
                service.teacherGetCourseLectures(this.teacher4.teacherId, this.lecture1.courseId)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 1, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('the teacher do not teach that course should return an empty list', function(done) {
                service.teacherGetCourseLectures(this.teacher5.teacherId, this.lecture1.courseId)
                    .then((lectures) => {
                        assert.strictEqual(lectures.length, 0, 'Wrong number of lectures');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('teacherGetCourses', function() {
            it('correct params should return a list of courses', function(done) {
                service.teacherGetCourse(this.teacher4.teacherId)
                    .then((courses) => {
                        assert.strictEqual(courses.length, 2, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('non-existing teacher should return an empty list', function(done) {
                service.teacherGetCourse(-1)
                    .then((courses) => {
                        assert.strictEqual(courses.length, 0, 'Wrong number of courses');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('isCourseTeachedBy', function() {
            it('correct params should return a teacher', function(done) {
                service.isCourseTeachedBy(this.lecture1.courseId)
                    .then((teacher) => {
                        assert.strictEqual(teacher.teacherId, this.teacher4.teacherId, 'Wrong teacher');
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('non-existing course should throw an error', function(done) {
                service.isCourseTeachedBy(-1)
                    .then((teacher) => {
                        done('This should fail');
                    })
                    .catch((err) => done());
            });
        });

        describe('doesLectureBelongCourse', function() {
            it('correct params should return a course', function(done) {
                service.doesLectureBelongCourse(this.lecture1.lectureId)
                    .then((course) => {
                        assert.strictEqual(course.courseId, this.lecture1.courseId, 'Wrong course');
                        done();
                    })
                    .catch((err) => done(err));
            });
            
            it('non-existing lecture should throw an error', function(done) {
                service.doesLectureBelongCourse(-1)
                    .then((course) => {
                        done('This should fail');
                    })
                    .catch((err) => done());
            });
        });

        /*
        // NOT EXPORTED FUNCTIONS

        describe('nextCheck', function() {
            it('', function(done) {
                done();
            });
            
            it('', function(done) {
                done();
            });

        });

        describe('checkForExpiredLectures', function() {
            it('', function(done) {
                done();
            });
            
            it('', function(done) {
                done();
            });

        });
        */
    });
}
module.exports = suite;