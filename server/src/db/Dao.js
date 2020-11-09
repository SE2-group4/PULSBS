/**
 * database access management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const sqlite = require('sqlite3');
const moment = require('moment');

const Teacher = require('./../entities/Teacher.js');
const Student = require('./../entities/Student.js');
const Lecture = require('./../entities/Lecture.js');
const EmailType = require('./../entities/EmailType.js');

let dbpath = './PULSBS.db'; // default
let db = null;

/**
 * open a new database connection
 * it closes existing connections before creating the new one
 * @param {string} dbpath
 */
exports.openConn = function(dbpath) {
    if(!(db == undefined || db == null))
        db.close();
    db = new sqlite.Database(dbpath, (err) => {
        if (err) throw err;
    });
    return;
}

/**
 * perform login
 * @param {Teacher | Student} user - email and password needed
 * @returns {Promise} promise
 */
exports.login = function(user) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * record a booking in the system
 * @param {Student} student 
 * @param {Lecture} lecture
 * @returns {Promise} promise
 */
exports.addBooking = function(student, lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Booking(studentId, lectureId) VALUES (?, ?)';

        db.run(sql, [student.studentId, lecture.lectureId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        })
    })
}

/**
 * get the list of lectures a student can attend to
 * only future lectures are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
exports.getLecturesByStudent = function(student) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Lecture \
            JOIN Course ON Lecture.lectureId = Course.courseId \
            JOIN Enrollment ON Enrollment.courseId = Course.courseId \
            WHERE Enrollment.studentId = ? AND DATE(Lecture.date) > DATE(?)';

        db.all(sql, [student.studentId, (new Date()).toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const lectures = rows.forEach(row => Lecture.from(row));
            resolve(lectures);
        });
    })
}

/**
 * get the list of courses a student is enrolled to
 * only courses for the current academic year are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
exports.getCoursesByStudent = function(student) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course \
        JOIN Enrollment ON Enrollment.courseId = Course.courseId \
        WHERE Enrollment.studentId = ? AND year = ?';

        db.all(sql, [student.studentId, _getCurrentAcademicYear()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const courses = rows.forEach(courses => Course.from(row));
            resolve(courses);
        });
    })
}

/**
 * get a list of lectures related to a specific course
 * only future lectures are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
exports.getLecturesByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Lecture \
            WHERE Lecture.courseId = ? AND DATE(Lecture.date) > DATE(?)';

        db.all(sql, [course.courseId, (new Date()).toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const lectures = rows.forEach(row => Lecture.from(row));
            resolve(lectures);
        });
    })
}

/**
 * get a list of students booked for a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
exports.getStudentsByLecture = function(lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User \
            JOIN Booking on User.userId = Booking.studentId \
            WHERE Booking.lectureId = ? AND User.type = STUDENT';

        db.all(sql, [lecture.lectureId], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const students = rows.forEach(row => Student.from(row));
            resolve(students);
        });
    })
}

/**
 * get a list of students enrolled in a specific course
 * only courses for the current academic year are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User \
        JOIN Enrollment ON User.userId = Enrollment.studentId \
        JOIN Course ON Enrollment.courseId = Course.courseId \
        WHERE Course.courseId = ? AND Course.year = ? AND User.type = STUDENT';

        db.all(sql, [course.courseId, _getCurrentAcademicYear()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const students = rows.forEach(row => Student.from(row));
            resolve(students);
        });
    })
}

/**
 * get a list of lectures a teacher will give
 * only lectures in the future are considered
 * @param {Teacher} teacher 
 * @returns {Promise} promise
 */
exports.getLecturesByTeacher = function(teacher) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Lecture \
            JOIN Course ON Lecture.courseId = Course.courseId \
            JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId \
            WHERE TeacherCourse.teacherId = ? AND DATE(Lecture.date) > DATE(?)';

        db.all(sql, [teacher.teacherId, (new Date()).toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const lectures = rows.forEach(row => Lecture.from(row));
            resolve(lectures);
        });
    })
}

/**
 * get a list of courses a teacher is holding
 * only courses in the current academic year are considered
 * @param {Teacher} teacher 
 * @returns {Promise} promise
 */
exports.getCoursesByTeacher = function(teacher) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course \
        JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId \
        WHERE TeacherCourse.teacherId = ? AND Course.year = ?';

        db.all(sql, [teacher.teacherId, _getCurrentAcademicYear()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const courses = rows.forEach(row => Course.from(row));
            resolve(courses);
        });
    })
}

/**
 * crea a new booking email for a student
 * @param {Student} student - studentId and email needed
 * @param {Lecture} lecture - lectureId, description and date needed
 * @returns {Promise} promise
 */
exports._createStudentBookingEmail = function(student, lecture) {
    return new Promise((resolve, reject) => {
    })
}

/**
 * create a new email to inform a teacher about students that will attend his/her lecture
 * @param {Lecture} lecture 
 * @returns {Promise} promise
 */
exports._createTeacherBookingsEmail = function(lecture) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get the current academic year
 * based on the server time
 * @returns {Number} year
 */
exports._getCurrentAcademicYear = function() {
    const now = moment();

    let year = now.year();
    // academic year: from October YYYY to September (YYYY +1)
    if(now.month() <= 8) // 8 = September (base 0)
        year--; // still the previous academic year

    return(year);
}

/**
 * create a log in the database of an email
 * @param {Teacher | Student} from - teacherId or studentId neeeded
 * @param {Teacher | Student} to - teacherId or studentId neeeded
 * @param {EmailType} emailType - emailTypeId needed
 */
exports.addEmail = function(from, to, emailType) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Email(from, to, emailTypeId) VALUES(?, ?, ?)';

        const fromId = from instanceof Teacher ? from.teacherId : from.studentId;
        const toId = to instanceof Teacher ? to.teacherId : to.studentId;

        db.run(sql, [fromId, toId, emailType.emailTypeId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    })
}