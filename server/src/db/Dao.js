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
 * init db 
 * @param {string} dbpath
 */
const init = async function init(dbpath = './PULSBS.db') {
    openConn(dbpath);
}
exports.init = init;

/**
 * get a user by its id
 * @param {Teacher|Student} user - teacher or student
 */
const getUserById = function(user) {
    const userId = user.teacherId ? user.teacherId : user.studentId;

    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE userId = ?`;
        db.get(sql, [userId], (err, row) => {
            if(err || !row) {
                reject('incorrect userId'); // TODO { error: '...' }
                return;
            }

            const fullUser = user.teacherId ? Teacher.from(row) : Student.from(row);
            resolve(fullUser);
        });
    });
}
exports.getUserById = getUserById;

/**
 * perform login
 * @param {Teacher | Student} user - email and password needed
 * @returns {Promise} promise
 */
const login = function(user) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE email = ? AND password = ?`;
        db.get(sql, [user.email, user.password], (err, row) => {
            if(err || !row) {
                reject('incorrect userId or password'); // no more info for security reasons // TODO { error: '...' }
                return;
            }

            let retUser = null;
            switch(row.type) {
                case 'TEACHER':
                    retUser = Teacher.from(row);
                    break;
                case 'STUDENT':
                    retUser = Student.from(row);
                    break;
                default:
                    reject('unexpected user type');
                    return;
            }
            
            resolve(retUser);
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
        const sql = `INSERT INTO Booking(studentId, lectureId) VALUES (?, ?)`;

        db.run(sql, [student.studentId, lecture.lectureId], function(err) {
            if(err) {
                if(err.errno == 19)
                    err = { error: 'The lecture was already booked'};
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
        const sql = `SELECT * FROM Lecture
            JOIN Course ON Lecture.lectureId = Course.courseId
            JOIN Enrollment ON Enrollment.courseId = Course.courseId
            WHERE Enrollment.studentId = ? AND DATE(Lecture.date) > DATE(?)`;

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
        const sql = `SELECT Course.* FROM Course
        JOIN Enrollment ON Enrollment.courseId = Course.courseId
        WHERE Enrollment.studentId = ? AND year = ?`;

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
        const sql = `SELECT * FROM Lecture
            WHERE Lecture.courseId = ? AND DATETIME(Lecture.date) >= DATETIME(?)`;

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
        const sql = `SELECT User.* FROM User
            JOIN Booking on User.userId = Booking.studentId
            WHERE Booking.lectureId = ? AND User.type = ?`;

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
        const sql = `SELECT User.* FROM User
        JOIN Enrollment ON User.userId = Enrollment.studentId
        JOIN Course ON Enrollment.courseId = Course.courseId
        WHERE Course.courseId = ? AND Course.year = ? AND User.type = ?`;

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
        const sql = `SELECT * FROM Lecture
            JOIN Course ON Lecture.courseId = Course.courseId
            JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId
            WHERE TeacherCourse.teacherId = ? AND DATE(Lecture.date) > DATE(?)`;

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
        const sql = `SELECT Course.* FROM Course
        JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId
        WHERE TeacherCourse.teacherId = ? AND Course.year = ?`;

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
        const sql = `SELECT Course.* FROM Course
            JOIN Lecture ON Course.courseId = Lecture.courseId
            WHERE Lecture.lectureId = ?`;
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
 * @deprecated
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
 * @deprecated
 */
const _createTeacherBookingsEmail = function(teacher, lecture) {
    return new Promise((resolve, reject) => {
        getCourseByLecture(lecture)
            .then((course) => {
                getStudentsByLecture(lecture)
                    .then((students) => {
                        const email = new Email(undefined, systemUser, teacher, new Date(), EmailType.TEACHER_ATTENDING_STUDENTS);
                        
                        emailService.sendStudentNumberEmail(teacher.email, course.description, lecture.date.toISOString(), students.length)
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
 * create a log in the database of an email
 * @param {Email} email
 */
const addEmail = function(email) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Email(fromId, toId, emailTypeId) VALUES(?, ?, ?)`;

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

/**
 * Get all the lectures that have the booking deadline equal to date
 * @param {Date} date 
 */
const getLecturesByDeadline = function(date) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture \
            JOIN Course ON Course.courseId = Lecture.lectureId \
            JOIN TeacherCourse ON TeacherCourse.courseId = Course.courseId \
            WHERE DATE(Lecture.bookingDeadline) = DATE(?)`;

        const now = new Date();
        db.all(sql, [now.toISOString()], (err, rows) => {
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
exports.getLecturesByDeadline = getLecturesByDeadline;

/**
 * Get the teacher given a course 
 * @param {Course} course 
 */
const getTeacherByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User
        JOIN TeacherCourse ON User.userId = TeacherCourse.teacherId
        WHERE TeacherCourse.courseId = ? AND User.type = ?`;

        db.get(sql, [course.courseId, "TEACHER"], (err, row) => {
            if(err) {
                reject(err);
                return
            }
            
            if(!row) {
                resolve({});
                return; 
            }

            resolve(Teacher.from(row));
        });
    });
}

exports.getTeacherByCourse = getTeacherByCourse;
