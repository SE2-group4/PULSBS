/**
 * database access management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const sqlite = require("sqlite3").verbose();
const moment = require("moment");
const path = require("path");

const Teacher = require("./../entities/Teacher.js");
const Student = require("./../entities/Student.js");
const Manager = require("./../entities/Manager.js");
const Officer = require("./../entities/Officer.js");
const Lecture = require("./../entities/Lecture.js");
const Course = require("./../entities/Course.js");
const Email = require("./../entities/Email.js");
const EmailQueue = require("./../entities/EmailQueue.js");
const Booking = require("./../entities/Booking.js");
const Class = require("./../entities/Class.js");
const EmailType = require("./../entities/EmailType.js");
const emailService = require("./../services/EmailService.js");
const { StandardErr } = require("./../utils/utils.js");
const User = require("../entities/User.js");
const { POINT_CONVERSION_COMPRESSED } = require("constants");
const Calendar = require("../entities/Calendar.js");

let db = null;

/**
 * list of hints for DB queries
 */
const DaoHint = {
    NO_HINT, // I know nothing about it
    NEW_VALUE, // insert new value
    ALREADY_PRESENT, // update an existing value
    // add more
};

/**
 * transform a db row into a specific type of user
 * @param {Object} row
 * @returns {User|Teacher|Manager|Support} specific user
 */
const _transformUser = function (row) {
    let retUser;
    let error = null;

    switch (row.type) {
        case "TEACHER":
            retUser = Teacher.from(row);
            break;
        case "STUDENT":
            retUser = Student.from(row);
            break;
        case "MANAGER":
            retUser = Manager.from(row);
            break;
        case "SUPPORT":
            retUser = Officer.from(row);
            break;
        default:
            error = StandardErr.new("Dao", StandardErr.errno.UNEXPECTED_TYPE, "unexpected user type");
    }
    return { retUser, error };
};
/*
let db = new sqlite.Database(dbpath, (err) => {
    if (err) throw err;
});
*/

/**
 * close the current DB connection
 * @param {Function} cb - callback
 */
const closeConn = function(cb) {
    if(db){
        db.close((err) => {
            db = null;
            if(cb)
                cb();
        });
    }
}
exports.closeConn = closeConn;

/**
 * open a new database connection
 * it closes existing connections before creating the new one
 * @param {String} dbpath
 * @param {Function} cb - callback
 */
const openConn = function openConn(dbpath = "./PULSBS.db", cb) {
    closeConn(() => {
        const cwd = __dirname;
        dbpath = path.join(cwd, dbpath);
        db = new sqlite.Database(dbpath, (err) => {
            if (err) throw StandardErr.new("Dao", StandardErr.errno.FAILURE, err.message);
        });
    
        db.get("PRAGMA foreign_keys = ON");
        db.on("profile", (query, time) => {
            query = query.replace(/ +(?= )/g, "");
            //console.log("QUERY EXECUTED");
            //console.log(query);
            //console.log("TIME: ", time);
        });

        cb();
    });
};
exports.openConn = openConn;

/**
 * init db
 * @param {string} dbpath
 */
const init = async function init(dbpath = "./PULSBS.db") {
    openConn(dbpath);
};
exports.init = init;

/**
 * get a user by its id
 * @param {User|Teacher|Student|Manager|Support} user - teacher or student
 */
const getUserById = function (user) {
    let userId = user.userId;
    if (user.teacherId) userId = user.teacherId;
    else if (user.studentId) userId = user.studentId;
    else if (user.managerId) userId = user.managerId;
    else if (user.supportId) userId = user.supportId;

    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE userId = ?`;
        db.get(sql, [userId], (err, row) => {
            if (err || !row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "incorrect userId"));
                return;
            }

            const { retUser, error } = _transformUser(row);
            if (error) {
                reject(error);
                return;
            }

            resolve(retUser);
        });
    });
};
exports.getUserById = getUserById;

/**
 * perform login
 * @param {Teacher | Student} user - email and password needed
 * @returns {Promise} promise
 */
const login = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE email = ? AND password = ?`;
        db.get(sql, [user.email, user.password], (err, row) => {
            if (err || !row) {
                reject(StandardErr.new("Dao", StandardErr.errno.WRONG_VALUE, "incorrect userId or password")); // no more info for security reasons
                return;
            }

            const { retUser, error } = _transformUser(row);
            if (error) {
                reject(error);
                return;
            }

            resolve(retUser);
        });
    });
};
exports.login = login;

/**
 * record a booking in the system
 * @param {Student} student
 * @param {Lecture} lecture
 * @returns {Promise} promise
 */
const addBooking = function (student, lecture) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Booking(studentId, lectureId, status) VALUES (?, ?, ?)`;

        db.run(sql, [student.studentId, lecture.lectureId, Booking.BookingType.BOOKED], function (err) {
            if (err) {
                if (err.errno == 19) {
                    // already present
                    // err = StandardErr.new("Dao", StandardErr.errno.ALREADY_PRESENT, "The lecture was already booked");
                    const sql = `UPDATE Booking SET status = ? WHERE studentId = ? AND lectureId = ?`;
                    db.run(sql, [Booking.BookingType.BOOKED, student.studentId, lecture.lectureId], function (err) {
                        if (err) {
                            reject(StandardErr.fromDao(err));
                            return;
                        }

                        if (this.changes == 0) {
                            reject(
                                new StandardErr(
                                    "Dao",
                                    StandardErr.errno.ALREADY_PRESENT,
                                    "You have already booked this lecture",
                                    404
                                )
                            );
                            return;
                        }

                        resolve(this.changes);
                        return;
                    });
                }

                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.lastID);
        });
    });
};
exports.addBooking = addBooking;

/**
 * remove a booking
 * @param {Student} student
 * @param {Lecture} lecture
 * @returns {Promise} promise
 */
const deleteBooking = function (student, lecture) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Booking SET status = ? WHERE studentId = ? AND lectureId = ?`;

        db.run(sql, [Booking.BookingType.UNBOOKED, student.studentId, lecture.lectureId], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.deleteBooking = deleteBooking;

/**
 * get the list of lectures a student can attend to
 * only future lectures are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
const getLecturesByStudent = function (student) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            JOIN Course ON Lecture.lectureId = Course.courseId
            JOIN Enrollment ON Enrollment.courseId = Course.courseId
            WHERE Enrollment.studentId = ? AND DATE(Lecture.startingDate) > DATE(?)
            ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, [student.studentId, new Date().toISOString()], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByStudent = getLecturesByStudent;

/**
 * get the list of courses a student is enrolled to
 * only courses for the current academic year are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
const getCoursesByStudent = function (student) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Course.* FROM Course
        JOIN Enrollment ON Enrollment.courseId = Course.courseId
        WHERE Enrollment.studentId = ? AND Enrollment.year = ?`;

        db.all(sql, [student.studentId, _getCurrentAcademicYear()], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const courses = [];
            rows.forEach((row) => courses.push(Course.from(row)));
            resolve(courses);
        });
    });
};
exports.getCoursesByStudent = getCoursesByStudent;

// TODO: confusing function.
// should consider refactor this function. It should return all lectures by CourseId.
// pass a date string if you want to apply a filter. Delete getLecturesByCourseId after refactor.
/**
 * get a list of lectures related to a specific course
 * only future lectures are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getLecturesByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            WHERE Lecture.courseId = ? AND DATETIME(Lecture.startingDate) >= DATETIME(?)`;

        db.all(sql, [course.courseId, new Date().toISOString()], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByCourse = getLecturesByCourse;

/**
 * get a list of students booked for a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getStudentsByLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User
            JOIN Booking on User.userId = Booking.studentId
            WHERE Booking.lectureId = ? AND User.type = ? AND Booking.status = ?`;

        db.all(sql, [lecture.lectureId, "STUDENT", Booking.BookingType.BOOKED], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const students = [];
            rows.forEach((row) => students.push(Student.from(row)));
            resolve(students);
        });
    });
};
exports.getStudentsByLecture = getStudentsByLecture;

/**
 * get a list of students enrolled in a specific course
 * only courses for the current academic year are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User
        JOIN Enrollment ON User.userId = Enrollment.studentId
        JOIN Course ON Enrollment.courseId = Course.courseId
        WHERE Course.courseId = ? AND Enrollment.year = ? AND User.type = ?`;

        db.all(sql, [course.courseId, _getCurrentAcademicYear(), "STUDENT"], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const students = [];
            rows.forEach((row) => students.push(Student.from(row)));
            resolve(students);
        });
    });
};
exports.getStudentsByCourse = getStudentsByCourse;

/**
 * get a list of lectures a teacher will give
 * only lectures in the future are considered
 * @param {Teacher} teacher
 * @returns {Promise} promise
 */
const getLecturesByTeacher = function (teacher) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            JOIN Course ON Lecture.courseId = Course.courseId
            JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId
            WHERE TeacherCourse.teacherId = ? AND DATE(Lecture.startingDate) > DATE(?)
            ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, [teacher.teacherId, new Date().toISOString()], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByTeacher = getLecturesByTeacher;

/**
 * get a list of courses a teacher is holding
 * only courses in the current academic year are considered
 * @param {Teacher} teacher - teacherId needed
 * @returns {Promise} promise
 */
const getCoursesByTeacher = function (teacher) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Course.* FROM Course
        JOIN TeacherCourse ON Course.courseId = TeacherCourse.courseId
        WHERE TeacherCourse.teacherId = ?`;

        db.all(sql, [teacher.teacherId], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const courses = [];
            rows.forEach((row) => courses.push(Course.from(row)));
            resolve(courses);
        });
    });
};
exports.getCoursesByTeacher = getCoursesByTeacher;

/**
 * get the course corrisponding to a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getCourseByLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Course.* FROM Course
            JOIN Lecture ON Course.courseId = Lecture.courseId
            WHERE Lecture.lectureId = ?`;
        db.get(sql, [lecture.lectureId], (err, row) => {
            if (err || !row) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(Course.from(row));
        });
    });
};
exports.getCourseByLecture = getCourseByLecture;

/**
 * get the current academic year
 * based on the server time
 * @returns {Number} year
 */
const _getCurrentAcademicYear = function () {
    const now = moment();

    let year = now.year();
    // academic year: from October YYYY to September (YYYY +1)
    if (now.month() <= 8)
        // 8 = September (base 0)
        year--; // still the previous academic year

    return year;
};
exports._getCurrentAcademicYear = _getCurrentAcademicYear;

/**
 * create a log in the database of an email
 * @param {Email} email
 */
const addEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Email(fromId, toId, emailType) VALUES(?, ?, ?)`;

        const fromId = email.from instanceof Teacher ? email.from.teacherId : email.from.studentId;
        const toId = email.to instanceof Teacher ? email.to.teacherId : email.to.studentId;

        db.run(sql, [fromId, toId, email.emailType], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.lastID);
        });
    });
};
exports.addEmail = addEmail;

/**
 * Get all the lectures that have the booking deadline equal to date
 * @param {Date} date
 */
const getLecturesByDeadline = function (date) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture \
            JOIN Course ON Course.courseId = Lecture.lectureId \
            JOIN TeacherCourse ON TeacherCourse.courseId = Course.courseId \
            WHERE DATE(Lecture.bookingDeadline) = DATE(?)
            ORDER BY DATETIME(Lecture.startingDate)`;

        const now = new Date();
        db.all(sql, [now.toISOString()], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByDeadline = getLecturesByDeadline;

/**
 * Get the teacher given a course
 * @param {Course} course
 */
const getTeacherByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User
            JOIN TeacherCourse ON User.userId = TeacherCourse.teacherId
            WHERE TeacherCourse.courseId = ? AND User.type = ?`;

        db.get(sql, [course.courseId, "TEACHER"], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            if (!row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "teacher not found"));
                return;
            }

            resolve(Teacher.from(row));
        });
    });
};
exports.getTeacherByCourse = getTeacherByCourse;

/**
 * get the list of lecture the student has booked
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
const getBookingsByStudent = function (student) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            JOIN Booking ON Booking.lectureId = Lecture.lectureId
            WHERE Booking.studentId = ? AND Booking.status = ?
            ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, [student.studentId, Booking.BookingType.BOOKED], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getBookingsByStudent = getBookingsByStudent;

/**
 * get the list of bookings for a specific student and in a specific periodo of time
 * @param {Student} student - studentId needed
 * @param {Object} periodOfTime - {Date} from (optional), {Date} to (optional)
 * @returns {Promise} promise
 */
const getBookingsByStudentAndPeriodOfTime = function (student, periodOfTime = {}) {
    return new Promise((resolve, reject) => {
        const sqlParams = [];
        let sql = `SELECT Lecture.* FROM Lecture
            JOIN Booking ON Booking.lectureId = Lecture.lectureId
            WHERE Booking.studentId = ? AND Booking.status = ?`;
        sqlParams.push(student.studentId, Booking.BookingType.BOOKED);

        // composing the SQL query
        if (periodOfTime.from && moment(periodOfTime.from).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) >= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.from).toISOString());
        }
        if (periodOfTime.to && moment(periodOfTime.to).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) <= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.to).toISOString());
        }
        sql += ` ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, sqlParams, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getBookingsByStudentAndPeriodOfTime = getBookingsByStudentAndPeriodOfTime;

/**
 * get lectures in a specific period of time
 * @param {Course} course - courseId needed
 * @param {Object} periodOfTime - {Date} from (optional), {Date} to (optional)
 * @returns {Promise} promise
 */
const getLecturesByCourseAndPeriodOfTime = function (course, periodOfTime = {}) {
    return new Promise((resolve, reject) => {
        const sqlParams = [];
        let sql = `SELECT Lecture.* FROM Lecture WHERE Lecture.courseId = ?`;
        sqlParams.push(course.courseId);

        // composing the SQL query
        if (periodOfTime.from && moment(periodOfTime.from).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) >= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.from).toISOString());
        }
        if (periodOfTime.to && moment(periodOfTime.to).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) <= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.to).toISOString());
        }
        sql += ` ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, sqlParams, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByCourseAndPeriodOfTime = getLecturesByCourseAndPeriodOfTime;

/**
 * Get a lecture given a lectureId
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getLectureById = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Lecture
            WHERE Lecture.lectureId = ?`;

        db.get(sql, [lecture.lectureId], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            if (!row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "incorrect lectureId"));
                return;
            }

            resolve(Lecture.from(row));
        });
    });
};
exports.getLectureById = getLectureById;

/**
 * Delete a lecture from Lecture given a lectureId
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const deleteLectureById = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Lecture WHERE lectureId = ?`;

        db.run(sql, [lecture.lectureId], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.deleteLectureById = deleteLectureById;

/**
 * Delete a email from EmailQueue given a queueId
 * @param {EmailQueue} emailQueue - emailQueue needed
 * @returns {Promise} promise
 */
const deleteEmailQueueById = function (emailQueue) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM EmailQueue WHERE queueId = ?`;

        db.run(sql, [emailQueue.queueId], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.deleteEmailQueueById = deleteEmailQueueById;

/**
 * Return all email in queue given a filter
 * @param {String} filter - Email.EmailType
 * @returns {Promise} promise
 */
const getEmailsInQueueByEmailType = function (emailType) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM EmailQueue WHERE emailType = ?`;

        db.all(sql, [emailType], function (err, rows) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const res = [];
            rows.forEach((row) => res.push(EmailQueue.from(row)));
            resolve(rows);
        });
    });
};
exports.getEmailsInQueueByEmailType = getEmailsInQueueByEmailType;

/**
 * Update a lecture delivery mode given a lectureId
 * @param {Lecture} lecture - lectureId, delivery needed
 * @returns {Promise} promise
 */
const updateLectureDeliveryMode = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Lecture SET delivery = ? WHERE lectureId = ?`;

        db.run(sql, [lecture.delivery.toUpperCase(), lecture.lectureId], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.updateLectureDeliveryMode = updateLectureDeliveryMode;

/**
 * Return all lectures + num of booked students per lecture given a course
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getLecturesByCoursePlusNumBookings = function (course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT lect.*, COUNT(book.studentId) as numBookings
            FROM Lecture lect 
            LEFT JOIN Booking book ON lect.lectureId = book.lectureId 
            WHERE lect.courseId = ? AND book.status IN (?, ?)
            GROUP BY lect.lectureId
            ORDER BY DATETIME(lect.startingDate)`;

        db.all(sql, [course.courseId, Booking.BookingType.BOOKED, Booking.BookingType.PRESENT], function (err, rows) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const res = rows.map((row) => {
                return { lecture: Lecture.create(row), numBookings: row.numBookings };
            });
            resolve(res);
        });
    });
};
exports.getLecturesByCoursePlusNumBookings = getLecturesByCoursePlusNumBookings;

/**
 * Return the number of booked students given a lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const getNumBookingsOfLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as numBookings FROM Booking WHERE lectureId = ? AND status IN (?, ?)`;

        db.get(sql, [lecture.lectureId, Booking.BookingType.BOOKED, Booking.BookingType.PRESENT], function (err, res) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(res.numBookings);
        });
    });
};
exports.getNumBookingsOfLecture = getNumBookingsOfLecture;

/**
 * Return the number of bookings given a lecture and a status
 * @param {Lecture} lecture - lectureId needed
 * @param {String} status - {BOOKED, PRESENT, CANCELLED, NOT_PRESENT}
 * @returns {Promise} promise
 */
const getNumBookingsOfLectureByStatus = function (lecture, status) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as count FROM Booking WHERE lectureId = ? AND status = ?`;

        db.get(sql, [lecture.lectureId, status], function (err, res) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(res);
        });
    });
};
exports.getNumBookingsOfLectureByStatus = getNumBookingsOfLectureByStatus;

/**
 * Get a list of lectures related to a specific course
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
const getLecturesByCourseId = function (course) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            WHERE Lecture.courseId = ?
            ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, [course.courseId], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getLecturesByCourseId = getLecturesByCourseId;

/**
 * check is a lecture belongs to a course
 * @param {Course} course - courseId needed
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const checkLectureAndCourse = function (course, lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(1) as count FROM Lecture
            WHERE Lecture.courseId = ? AND Lecture.lectureId = ?`;

        db.get(sql, [course.courseId, lecture.lectureId], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(row);
        });
    });
};
exports.checkLectureAndCourse = checkLectureAndCourse;

/**
 * get all courses
 * @returns {Promise} promise of array of Course
 */
const getAllCourses = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT Course.* FROM Course";

        db.all(sql, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const courses = [];
            rows.forEach((course) => courses.push(Course.from(course)));
            resolve(courses);
        });
    });
};
exports.getAllCourses = getAllCourses;

/**
 * insert a student into a waiting list
 * @param {Student} student - studentId needed
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const studentPushQueue = function (student, lecture) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO WaitingList(studentId, lectureId, date) VALUES (?, ?, ?)`;

        db.run(sql, [student.studentId, lecture.lectureId, new Date().toISOString], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.studentPushQueue = studentPushQueue;

/**
 * retrieve the first student from the waiting list given a lecture
 * it is removed from the waiting list too
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
const studentPopQueue = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User
            JOIN WaitingList ON WaitingList.studentId = User.userId
            WHERE DATETIME(WaitingList.date) = (SELECT MIN(DATETIME(date)) FROM WaitingList WHERE lectureId = ?)`;

        db.get(sql, [lecture.lectureId], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }
            if (!row) {
                reject(new StandardErr("Dao", StandardErr.errno.NOT_EXISTS, "No student found", 404));
                return;
            }

            const student = Student.from(row);
            const sqlCleaning = `DELETE FROM WaitingList WHERE studentId = ? AND lectureId = ?`;

            db.run(sqlCleaning, [student.studentId, lecture.lectureId], function (err) {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }
                if (this.changes != 1) {
                    reject(
                        new StandardErr("Dao", StandardErr.errno.NOT_EXISTS, "Cannot delete from waiting list", 500)
                    );
                    return;
                }

                resolve(student);
            });
        });
    });
};
exports.studentPopQueue = studentPopQueue;

/**
 * get a list of students and teachers that a specific student has been in contact to
 * from the specificied date to the previous or in the next 14 days
 * @param {Student} student - studentId
 * @param {Date} date
 * @returns {Promise} promise
 */
const managerGetReport = function (student, date) {
    return new Promise((resolve, reject) => {
        const sqlStudents = `SELECT User.* FROM User
            JOIN Booking ON Booking.studentId = User.userId
            WHERE Booking.status = ? AND Booking.lectureId IN (
                SELECT Booking.lectureId FROM Booking AS Booking2
                JOIN Lecture ON Lecture.LectureId = Booking2.lectureId
                WHERE Booking2.studentId = ? AND Booking2.status = ?
                    AND DATETIME(Lecture.startingDate, 'start of day') >= DATETIME(?, '-14 day', 'start of day')
                    AND DATETIME(Lecture.startingDate, 'start of day') <= DATETIME(?, '+14 day', 'start of day')
                )
            GROUP BY User.userId`;
        const sqlTeachers = `SELECT User.* FROM User
            JOIN TeacherCourse ON TeacherCourse.teacherId = User.userId
            JOIN Lecture ON Lecture.courseId = TeacherCourse.courseId
            WHERE Lecture.lectureId IN (
                SELECT Booking.lectureId FROM Booking
                JOIN Lecture AS Lecture2 ON Lecture2.LectureId = Booking.lectureId
                WHERE Booking.studentId = ? AND Booking.status = ?
                    AND DATETIME(Lecture2.startingDate, 'start of day') >= DATETIME(?, '-14 day', 'start of day')
                    AND DATETIME(Lecture2.startingDate, 'start of day') <= DATETIME(?, '+14 day', 'start of day')
                )
            GROUP BY User.userId`;

        date = date ? new Date(date) : new Date();

        db.all(
            sqlStudents,
            [
                Booking.BookingType.PRESENT,
                student.studentId,
                Booking.BookingType.PRESENT,
                date.toISOString(),
                date.toISOString(),
            ],
            (err, rows) => {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }
                let students = rows.map((row) => User.from(row));
                students = students.filter((currStudent) => currStudent.userId != student.userId); // not the student passed as parametre

                db.all(
                    sqlTeachers,
                    [student.studentId, Booking.BookingType.PRESENT, date.toISOString(), date.toISOString()],
                    (err, rows) => {
                        if (err) {
                            reject(StandardErr.fromDao(err));
                            return;
                        }
                        const teachers = rows.map((row) => User.from(row));
                        const users = students.concat(teachers);

                        resolve(users);
                    }
                );
            }
        );
    });
};
exports.managerGetReport = managerGetReport;

/**
 * get a user by its ssn
 * @param {User|Teacher|Student|Manager|Support} user
 */
const getUserBySsn = function (user) {
    let ssn = user.ssn;

    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE ssn = ?`;
        db.get(sql, [ssn], (err, row) => {
            if (err || !row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "incorrect ssn"));
                return;
            }

            const { retUser, error } = _transformUser(row);
            if (error) {
                reject(error);
                return;
            }

            resolve(retUser);
        });
    });
};
exports.getUserBySsn = getUserBySsn;

/**
 * get the class from a lecture
 * @param {Lecture} lecture
 * @retuns {Promise} promise
 */
const getClassByLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Class.* FROM Class
            JOIN Lecture ON Lecture.classId = Class.classId
            WHERE Lecture.lectureId = ?`;

        db.get(sql, [lecture.lectureId], (err, row) => {
            if (err || !row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "incorrect userId"));
                return;
            }

            resolve(Class.from(row));
        });
    });
};
exports.getClassByLecture = getClassByLecture;

// TODO not tested
// added by Francesco
/**
 * execute a batch of sql statements
 * @returns {Promise} promise
 */
const execBatch = function (queries) {
    return new Promise((resolve, reject) => {
        db.run("BEGIN TRANSACTION;");
        queries.forEach((query) => db.run(query, function (error) {
            if(error) reject(error);
        }));
        db.run("END TRANSACTION;", () => resolve());
    });
};
exports.execBatch = execBatch;

/**
 * get course given its code
 * @param {Integer} code
 */
const getCourseByCode = function (code) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Course.* FROM Course WHERE code = ?`;
        db.get(sql, [code], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(Course.from(row));
        });
    });
};
exports.getCourseByCode = getCourseByCode;

/**
 * get a student given his serial number
 * @param {Integer} serialNumber
 */
const getStudentBySN = function (serialNumber) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE type = STUDENT AND serialNumber = ?`;
        db.get(sql, [serialNumber], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(Student.from(row));
        });
    });
};
exports.getStudentBySN = getStudentBySN;

/**
 * get all students
 * @returns {Promise} promise of array of Student
 */
const getAllStudents = function () {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE type = "STUDENT"`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const students = [];
            rows.forEach((row) => students.push(Student.from(row)));
            resolve(students);
        });
    });
};
exports.getAllStudents = getAllStudents;

/**
 * get all teachers
 * @returns {Promise} promise of array of Teacher
 */
const getAllTeachers = function () {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* FROM User WHERE type = "TEACHER"`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const res = [];
            rows.forEach((row) => res.push(Teacher.from(row)));
            resolve(res);
        });
    });
};
exports.getAllTeachers = getAllTeachers;
/**
 *
 * @param {Student} student - studentId needed
 * @param {Object} periodOfTime - {Date} from (optional), {Date} to (optional)
 */
const getWaitingsByStudentAndPeriodOfTime = function (student, periodOfTime = {}) {
    return new Promise((resolve, reject) => {
        const sqlParams = [];
        let sql = `SELECT Lecture.* FROM Lecture
            JOIN WaitingList ON WaitingList.lectureId = Lecture.LectureId
            WHERE WaitingList.studentId = ?`;
        sqlParams.push(student.studentId);

        // composing the SQL query
        if (periodOfTime.from && moment(periodOfTime.from).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) >= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.from).toISOString());
        }
        if (periodOfTime.to && moment(periodOfTime.to).isValid()) {
            sql += ` AND DATETIME(Lecture.startingDate) <= DATETIME(?)`;
            sqlParams.push(moment(periodOfTime.to).toISOString());
        }
        sql += ` ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(sql, sqlParams, (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            const lectures = [];
            rows.forEach((row) => lectures.push(Lecture.from(row)));
            resolve(lectures);
        });
    });
};
exports.getWaitingsByStudentAndPeriodOfTime = getWaitingsByStudentAndPeriodOfTime;

/**
 * check how many free seats a lecture has
 * @param {Lecture} lecture
 * @returns {Number} number of free seats
 */
const lectureHasFreeSeats = function (lecture) {
    return new Promise((resolve, reject) => {
        Promise.all([getNumBookingsOfLecture(lecture), getClassByLecture(lecture)])
            .then((values) => {
                const currBookings = Number(values[0]);
                const classCapacity = Number(values[1].capacity);
                const availableSeats = classCapacity - currBookings;
                resolve(availableSeats);
            })
            .catch(reject);
    });
};
exports.lectureHasFreeSeats = lectureHasFreeSeats;

/**
 * get a class by its description
 * @param {Class} class_ 
 * @return {Promise} promise of class
 */
const getClassByDescription = function(class_) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Class WHERE description = ?`;

        db.get(sql, [class_.description], (err, row) => {
            if(err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(Lecture.from(row));
        });
    });
}
exports.getClassByDescription = getClassByDescription;

/**
 * insert a new lecture into DB
 * @param {Lecture} lecture 
 * @returns {Promise} promise of int
 */
const addLecture = function(lecture) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Lecture(courseId, classId, startingDate, duration, bookingDeadline, delivery
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
                lecture.courseId,
                lecture.courseId,
                lecture.startingDate.toISOString(),
                lecture.duration,
                lecture.bookingDeadline.toISOString(),
                lecture.delivery
            ], function(err) {
                if(err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                resolve(this.changes);
         });
    });
}
exports.addLecture = addLecture;

/**
 * get the list of all calendar periods
 * @returns {Promise} promise of array of Calendar
 */
const _getCalendars = function() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Calendar`;

        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(rows.map(row => Calendar.from(row)));
        });
    });
};

/**
 * generate a list of valid dates from now to the end of the current period of time
 * these dates are based on the calendar valid periods
 * @param {Schedule} schedule 
 * @returns {Promise} promise of array of Dates
 */
const _generateDatesBySchedule = function(schedule) {
    return new Promise((resolve, reject) => {
        this._getCalendars()
            .then((calendars) => {
                
            })
            .catch(reject);
    });
}
exports._generateDatesBySchedule = _generateDatesBySchedule; // export needed for testing

/**
 * generate a list of lecture given a schedule
 * @param {Schedule} schedule 
 * @param {DaoHint} hint
 * @returns {Promise} promise of bool - true if everything has gone right, false otherwise
 */
const _generateLecturesBySchedule = function(schedule, hint = DaoHint.NO_HINT) {
    return new Promise((resolve, reject) => {
        // first of all, get data which are in common for all lectures we are going to generate
        Promise.all([
                this.getCourseByCode(schedule.code),
                this.getClassByDescription(schedule.roomId)
            ])
            .then((values) => {
                const actualCourse = values[0];
                const actualClass = values[1];

                let actualStartingTime;
                let actualEndingTime;
                try {
                    actualStartingTime = moment.duration(schedule.startingTime).format('hh:mm:ss'); // no day, only HH:MM:SS
                    actualEndingTime = moment.duration(schedule.endingTime).format('hh:mm:ss'); // no day, only HH:MM:SS
                } catch(err) {
                    reject(StandardErr.new('Dao', StandardErr.errno.UNEXPECTED_VALUE, 'Wrong date', 404));
                    return;
                }
                const duration = actualEndingTime.subtract(actualStartingTime);
                const actualDuration = duration.milliseconds(); // in milliseconds

                // generate the list of dates of all lectures
                const dates = this._generateDatesBySchedule(schedule);
                const actualStartingDates = dates.map(date => date.add(actualStartingTime));
                const bookingDeadlineTime = moment.duration("23:00:00").subtract(1, 'day'); // by default, the booking deadline is the day before al 23:00
                const actualBookingDeadlines = dates.map(date => date.add(bookingDeadlineTime));

                // now, let's go to generate every single and specific lecture
                const promises = [];
                for(let i=0; i<dates.length; i++) {
                    const currLecture = new Lecture();
                    currLecture.courseId = actualCourse.courseId;
                    currLecture.classId = actualCourse.courseId;
                    currLecture.startingDate = actualStartingDates[i];
                    currLecture.duration = actualDuration;
                    currLecture.bookingDeadline = actualBookingDeadlines[i];
                    currLecture.delivery = Lecture.DeliveryType.PRESENCE; // by default, a lecture will be delivered in presence

                    promises.push(this.addLecture(lecture));
                }

                Promise.all(promises)
                    .then((values) => {
                        if(values.some(e => e === 0 )) { // if a lecture has not been inserted
                            
                        }
                    })
                    .catch(reject);
            });
    });
}
exports._generateLecturesBySchedule = _generateLecturesBySchedule; // export needed for testing