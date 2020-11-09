/**
 * test suite for the dao module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');

const dao = require('../src/db/Dao.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const prepare = require('../src/db/Preparedb.js');

const suite = describe('Dao.js', function() {
    let student;
    let teacher;
    let lecture;
    let course;

    before(function(done) {
        student = new Student(1);
        teacher = new Teacher(4);
        lecture = new Lecture(3);
        course = new Course(3);

        done();
    });

    beforeEach(function(done) {
        prepare(undefined, undefined, false)
            .then(() => done());
    });

    describe('login', function() {
        it('correct data should perform login', function(done) {
            done();
        });

        it('incorrect data should not perform login', function(done) {
            done();
        });
    });

    describe('addBooking', function() {
        it('correct data should insert a new booking', function(done) {
            dao.addBooking(student, lecture)
                .then((retVal) => {
                    assert.ok(retVal > 0, 'Booking not added');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByStudent', function() {
        it('non empty lecture should get the list of students', function(done) {
            dao.getLecturesByStudent(student)
                .then((lectures) => {
                    assert.ok(lectures.length === 3, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getCoursesByStudent', function() {
        it('non empty course should get the list of students', function(done) {
            dao.getCoursesByStudent(student)
                .then((courses) => {
                    assert.ok(courses.length === 3, 'Wrong number of courses');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByCourse', function() {
        it('non empty course should get the list of lectures', function(done) {
            dao.getLecturesByCourse(course)
                .then((lectures) => {
                    assert.ok(lectures.length === 1, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getStudentsByLecture', function() {
        it('non empty lecture should get the list of students', function(done) {
            dao.getStudentsByLecture(lecture)
                .then((students) => {
                    assert.ok(students.length === 3, 'Wrong number of students');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getStudentsByCourse', function() {
        it('non empty coure should get the list of students', function(done) {
            dao.getStudentsByCourse(course)
                .then((students) => {
                    assert.ok(students.length === 3, 'Wrong number of students');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByTeacher', function() {
        it('non empty teacher should get the list of lectures', function(done) {
            dao.getLecturesByTeacher(teacher)
                .then((lectures) => {
                    assert.ok(lectures.length === 2, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getCoursesByTeacher', function() {
        it('non empty teacher should get the list of courses', function(done) {
            dao.getCoursesByTeacher(teacher)
                .then((courses) => {
                    assert.ok(courses.length == 2, 'Wrong number of courses');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('_createStudentBookingEmail', function() {
        it('correct data should get a student email', function(done) {
            const emailType = EmailType.STUDENT_NEW_BOOKING;
            
            done();
        });
    });

    describe('_createTeacherBookingsEmail', function() {
        it('correct data should get a teacher email', function(done) {
            const emailType = EmailType.TEACHER_ATTENDING_STUDENTS;

            done();
        });
    });

    describe('_getCurrentAcademicYear', function() {
        it('should get this year', function(done) {
            const retVal = dao._getCurrentAcademicYear();
            assert.ok(retVal === 2020, 'Wrong academic year'); // check this manually
            done();
        });
    });

    describe('addEmail', function() {
        it('correct data should insert a new email', function(done) {
            const emailType = EmailType.STUDENT_NEW_BOOKING;
            dao.addEmail(teacher, student, emailType)
                .then((retVal) => {
                    assert.ok(retVal > 0, 'Email not inserted');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});

module.exports = suite;