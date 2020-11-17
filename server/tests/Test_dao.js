/**
 * test suite for the dao module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');

const suite = describe('Dao.js', function() {
    let student1;
    let teacher4;
    let lecture2, lecture3;
    let course3;

    before(function(done) {
        student1 = new Student(1, 'Aldo', 'Baglio', 'aldo.baglio@agg.it', 'aldo');
        teacher4 = new Teacher(4);
        lecture2 = new Lecture(2);
        lecture3 = new Lecture(3);
        course3 = new Course(3);

        dao.openConn('testing.db', 'testing.sql');

        done();
    });

    beforeEach(function(done) {
        prepare(undefined, undefined, true)
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('login', function() {
        it('correct data should perform login', function(done) {
            dao.login(student1)
                .then((retStudent) => {
                    assert.strictEqual(retStudent.studentId, student1.studentId, 'Wrong user retrieved');
                    done()
                })
                .catch((err) => done(err));
        });

        it('incorrect data should not perform login', function(done) {
            dao.login(new Student(-1, 'invalid', 'invalid', 'invalid', 'invalid'))
                .then((retStudent) => {
                    done('No user should be retrieved');
                })
                .catch((err) => done()); // correct case
        });
    });

    describe('addBooking', function() {
        it('correct data should insert a new booking', function(done) {
            dao.addBooking(student1, lecture2)
                .then((retVal) => {
                    assert.ok(retVal > 0, 'Booking not added');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByStudent', function() {
        it('non empty lecture should get the list of students', function(done) {
            dao.getLecturesByStudent(student1)
                .then((lectures) => {
                    assert.ok(lectures, 'No returned valued received');
                    assert.ok(lectures.length === 3, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getCoursesByStudent', function() {
        it('non empty course should get the list of students', function(done) {
            dao.getCoursesByStudent(student1)
                .then((courses) => {
                    assert.ok(courses, 'No returned valued received');
                    assert.ok(courses.length === 3, 'Wrong number of courses');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByCourse', function() {
        it('non empty course should get the list of lectures', function(done) {
            dao.getLecturesByCourse(course3)
                .then((lectures) => {
                    assert.ok(lectures, 'No returned valued received');
                    assert.ok(lectures.length === 1, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getStudentsByLecture', function() {
        it('non empty lecture should get the list of students', function(done) {
            dao.getStudentsByLecture(lecture3)
                .then((students) => {
                    assert.ok(students, 'No returned valued received');
                    assert.ok(students.length === 3, 'Wrong number of students');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getStudentsByCourse', function() {
        it('non empty coure should get the list of students', function(done) {
            dao.getStudentsByCourse(course3)
                .then((students) => {
                    assert.ok(students, 'No returned valued received');
                    assert.ok(students.length === 3, 'Wrong number of students');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getLecturesByTeacher', function() {
        it('non empty teacher should get the list of lectures', function(done) {
            dao.getLecturesByTeacher(teacher4)
                .then((lectures) => {
                    assert.ok(lectures, 'No returned valued received');
                    assert.ok(lectures.length === 2, 'Wrong number of lectures');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('getCoursesByTeacher', function() {
        it('non empty teacher should get the list of courses', function(done) {
            dao.getCoursesByTeacher(teacher4)
                .then((courses) => {
                    assert.ok(courses, 'No returned valued received');
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
            const email = new Email(undefined, teacher4, student1, new Date(), emailType, 'test subject', 'test body');
            dao.addEmail(email)
                .then((retVal) => {
                    assert.ok(retVal > 0, 'Email not inserted');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});

module.exports = suite;