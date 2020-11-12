/**
 * database access management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const sqlite = require('sqlite3');
const moment = require('moment');
const path = require('path');

const Teacher = require('./../entities/Teacher.js');
const Student = require('./../entities/Student.js');
const Lecture = require('./../entities/Lecture.js');
const Course = require('./../entities/Course.js');
const Email = require('./../entities/Email.js');
const EmailType = require('./../entities/EmailType.js');
const emailService = require('./../services/EmailService.js');

let db = null;
/*
let db = new sqlite.Database(dbpath, (err) => {
    if (err) throw err;
});
*/

/**
 * open a new database connection
 * it closes existing connections before creating the new one
 * @param {String} dbpath
 */
const openConn = function openConn(dbpath = './PULSBS.db') {
    if(db)
        db.close();

    const cwd = __dirname;
    dbpath = path.join(cwd, dbpath);
    db = new sqlite.Database(dbpath, (err) => {
        if (err) throw(err);
    });

    return;
}
exports.openConn = openConn;

/**
 * perform login
 * @param {Teacher | Student} user - email and password needed
 * @returns {Promise} promise
 */
const login = function(user) {
    return new Promise((resolve, reject) => {
        // more specific type checks
        let userType = '';
        userType = user instanceof Teacher ? 'TEACHER' : userType;
        userType = user instanceof Student ? 'STUDENT' : userType;

        const sql = 'SELECT * FROM User WHERE userId = ? AND password = ? AND type = ?';
        db.get(sql, [user.userId, user.password, userType], (err, row) => {
            if(err || !row) {
                reject('incorrect userId or password'); // no more info for security reasons
                return;
            }

            let user = null;
            switch(row.type) {
                case 'TEACHER':
                    user = Teacher.from(row);
                    break;
                case 'STUDENT':
                    user = Student.from(row);
                    break;
                default:
                    reject('unexpected user type');
                    return;
            }
            
            resolve(user);
        });
    })
}
exports.login = login;

/**
 * record a booking in the system
 * @param {Student} student 
 * @param {Lecture} lecture
 * @returns {Promise} promise
 */
const addBooking = function(student, lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Booking(studentId, lectureId) VALUES (?, ?)';

        db.run(sql, [student.studentId, lecture.lectureId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    })
}
exports.addBooking = addBooking;

/**
 * get the list of lectures a student can attend to
 * only future lectures are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
const getLecturesByStudent = function(student) {
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

            const lectures = [];
            rows.forEach(row => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    })
}
exports.getLecturesByStudent = getLecturesByStudent;

/**
 * get the list of courses a student is enrolled to
 * only courses for the current academic year are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
const getCoursesByStudent = function(student) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course \
        JOIN Enrollment ON Enrollment.courseId = Course.courseId \
        WHERE Enrollment.studentId = ? AND year = ?';

        db.all(sql, [student.studentId, _getCurrentAcademicYear()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const courses = [];
            rows.forEach(row => courses.push(Course.from(row)));
            resolve(courses);
        });
    })
}
exports.getCoursesByStudent = getCoursesByStudent;

/**
 * get a list of lectures related to a specific course
 * only future lectures are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getLecturesByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Lecture \
            WHERE Lecture.courseId = ? AND DATE(Lecture.date) >= DATE(?)';

        db.all(sql, [course.courseId, (new Date()).toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const lectures = [];
            rows.forEach(row => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    })
}
exports.getLecturesByCourse = getLecturesByCourse;

/**
 * get a list of students booked for a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getStudentsByLecture = function(lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User \
            JOIN Booking on User.userId = Booking.studentId \
            WHERE Booking.lectureId = ? AND User.type = ?';

        db.all(sql, [lecture.lectureId, 'STUDENT'], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const students = [];
            rows.forEach(row => students.push(Student.from(row)));
            resolve(students);
        });
    })
}
exports.getStudentsByLecture = getStudentsByLecture;

/**
 * get a list of students enrolled in a specific course
 * only courses for the current academic year are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User \
        JOIN Enrollment ON User.userId = Enrollment.studentId \
        JOIN Course ON Enrollment.courseId = Course.courseId \
        WHERE Course.courseId = ? AND Course.year = ? AND User.type = ?';

        db.all(sql, [course.courseId, _getCurrentAcademicYear(), 'STUDENT'], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const students = [];
            rows.forEach(row => students.push(Student.from(row)));
            resolve(students);
        });
    })
}
exports.getStudentsByCourse = getStudentsByCourse;

/**
 * get a list of lectures a teacher will give
 * only lectures in the future are considered
 * @param {Teacher} teacher 
 * @returns {Promise} promise
 */
const getLecturesByTeacher = function(teacher) {
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

            const lectures = [];
            rows.forEach(row => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    })
}
exports.getLecturesByTeacher = getLecturesByTeacher;

/**
 * get a list of courses a teacher is holding
 * only courses in the current academic year are considered
 * @param {Teacher} teacher - teacherId needed 
 * @returns {Promise} promise
 */
const getCoursesByTeacher = function(teacher) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course \
        JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId \
        WHERE TeacherCourse.teacherId = ? AND Course.year = ?';

        db.all(sql, [teacher.teacherId, _getCurrentAcademicYear()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const courses = [];
            rows.forEach(row => courses.push(Course.from(row)));
            resolve(courses);
        });
    })
}
exports.getCoursesByTeacher = getCoursesByTeacher;

/**
 * get the course corrisponding to a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getCourseByLecture = function(lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course \
            JOIN Lecture ON Course.courseId = Lecture.courseId \
            WHERE Lecture.lectureId = ?';
        db.get(sql, [lecture.lectureId], (err, row) => {
            if(err || !row) {
                reject(err);
                return
            }

            resolve(Course.from(row));
        });
    })
}
exports.getCourseByLecture = getCourseByLecture;

/**
 * crea a new booking email for a student
 * @param {Student} student - studentId and email needed
 * @param {Lecture} lecture - lectureId, courseId and date needed
 * @returns {Promise} promise
 */
const _createStudentBookingEmail = function(student, lecture) {
    return new Promise((resolve, reject) => {
        getCourseByLecture(lecture)
            .then((course) => {
                const email = new Email(undefined, systemUser, student, new Date(), EmailType.STUDENT_NEW_BOOKING);

                emailService.sendConfirmationBookingEmail(student.email, course.description, lectures.date.toISOString())
                    .then(addEmail(email)
                        .then(() => resolve)
                        .catch((err) => reject(err)))
                    .catch((err) => reject(err));
            });
    })
}
exports._createStudentBookingEmail = _createStudentBookingEmail;

/**
 * create a new email to inform a teacher about students that will attend his/her lecture
 * @param {Teacher} teacher
 * @param {Lecture} lecture 
 * @returns {Promise} promise
 */
const _createTeacherBookingsEmail = function(teacher, lecture) {
    return new Promise((resolve, reject) => {
        getCourseByLecture(lecture)
            .then((course) => {
                getStudentsByLecture(lecture)
                    .then((students) => {
                        const email = new Email(undefined, systemUser, teacher, new Date(), EmailType.TEACHER_ATTENDING_STUDENTS);
                        
                        emailService.sendStudentNumberEmail(teacher.email. course.description, lecture.date.toISOString(), students.length)
                            .then(addEmail(email)
                                .then(() => resolve)
                                .catch((err) => reject(err)))
                            .catch((err) => reject(err));
                    });
            });
    })
}
exports._createTeacherBookingsEmail = _createTeacherBookingsEmail;

/**
 * get the current academic year
 * based on the server time
 * @returns {Number} year
 */
const _getCurrentAcademicYear = function() {
    const now = moment();

    let year = now.year();
    // academic year: from October YYYY to September (YYYY +1)
    if(now.month() <= 8) // 8 = September (base 0)
        year--; // still the previous academic year

    return(year);
}
exports._getCurrentAcademicYear = _getCurrentAcademicYear;

/**
 * email service adapter/interface
 * @param {Email} email 
 * @returns {Promise} promise
 * 
 * TODO: IMPLEMENT OR DELETE
 */
const _emailSender = function(email) {
    return new Promise((resolve, reject) => {
        const cb = () => { addEmail(email).then(resolve()) };
        switch(email.emailType) {
            case EmailType.STUDENT_NEW_BOOKING:
                break;
            case EmailType.TEACHER_ATTENDING_STUDENTS:
                break;
            default:
                reject({ error : 'Unexpected email type' });
        }
    });
}
exports._emailSender = _emailSender;

/**
 * create a log in the database of an email
 * @param {Email} email
 */
const addEmail = function(email) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Email(fromId, toId, emailTypeId) VALUES(?, ?, ?)';

        const fromId = email.from instanceof Teacher ? email.from.teacherId : email.from.studentId;
        const toId = email.to instanceof Teacher ? email.to.teacherId : email.to.studentId;

        db.run(sql, [fromId, toId, email.emailType], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    })
}
exports.addEmail = addEmail;
