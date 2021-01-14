/*
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
const Schedule = require("./../entities/Schedule.js");
const { StandardErr } = require("./../utils/utils.js");
const User = require("../entities/User.js");
const { POINT_CONVERSION_COMPRESSED } = require("constants");
const Calendar = require("../entities/Calendar.js");

let db = null;

/**
 * list of hints for DB queries
 */
const DaoHint = {
    NO_HINT: "NO_HINT", // I know nothing about it
    NEW_VALUE: "NEW_VALUE", // insert new value
    ALREADY_PRESENT: "ALREADY_PRESENT", // update an existing value
    // add more
};

exports.DaoHint = DaoHint;

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

const closeConn = function (callback) {
    if (db) {
        db.close((err) => {
            if (err !== null) console.log("failed closing the db", err);
            db = null;
            if (callback) callback();
        });
    }
};
exports.closeConn = closeConn;

// rename it
function reallyOpenConn(dbpath = "./PULSBS.db", cb = () => {}) {
    const cwd = __dirname;
    dbpath = path.join(cwd, dbpath);
    db = new sqlite.Database(dbpath, (err) => {
        if (err) throw StandardErr.new("Dao", StandardErr.errno.FAILURE, err.message);

        db.get("PRAGMA foreign_keys = ON");
        //db.on("profile", (query, time) => {
        //    query = query.replace(/ +(?= )/g, "");
        //    console.log("QUERY EXECUTED");
        //    console.log(query);
        //    console.log("TIME: ", time);
        //});

        if (cb) cb();
    });
}

/**
 * open a new database connection
 * it closes existing connections before creating the new one
 * @param {String} dbpath
 * @param {Function} cb - callback
 */
const openConn = function openConn(dbpath = "./PULSBS.db", cb = () => {}) {
    if (db) db.close(() => reallyOpenConn(dbpath, cb));
    else {
        reallyOpenConn(dbpath, cb);
    }
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
        let sql = `INSERT INTO Booking(studentId, lectureId, status) VALUES (?, ?, ?)`;

        db.run(sql, [student.studentId, lecture.lectureId, Booking.BookingType.BOOKED], function (err) {
            if (err) {
                if (err.errno == 19) {
                    // already present
                    // err = StandardErr.new("Dao", StandardErr.errno.ALREADY_PRESENT, "The lecture was already booked");
                    sql = `UPDATE Booking SET status = ? WHERE studentId = ? AND lectureId = ?`;
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
 * A lecture is considered booked if Bookings.status is one of these states: BOOKED, PRESENT, NOT_PRESENT
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} array of Student's instances
 */
const getBookedStudentsByLecture = function (lecture, withStatus = true) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT User.* ${withStatus ? ", Booking.status as bookingStatus" : ""}
            FROM User
            JOIN Booking on User.userId = Booking.studentId
            WHERE Booking.lectureId = ? AND User.type = ? AND Booking.status IN (?, ?, ?)`;

        db.all(
            sql,
            [
                lecture.lectureId,
                "STUDENT",
                Booking.BookingType.BOOKED,
                Booking.BookingType.PRESENT,
                Booking.BookingType.NOT_PRESENT,
            ],
            (err, rows) => {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                const students = rows.map((row) => {
                    if (withStatus) {
                        const bookingStatus = row.bookingStatus;
                        delete row.bookingStatus;
                        return { student: Student.from(row), bookingStatus };
                    }
                    return Student.from(row);
                });

                resolve(students);
            }
        );
    });
};
exports.getBookedStudentsByLecture = getBookedStudentsByLecture;

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
        const sql = `SELECT Lecture.* FROM Lecture
            JOIN Course ON Course.courseId = Lecture.lectureId
            JOIN TeacherCourse ON TeacherCourse.courseId = Course.courseId
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
 * A lecture is considered booked if Bookings.status is one of these states: BOOKED, PRESENT, NOT_PRESENT
 * @param {Student} student - studentId needed
 * @returns {Promise} array of Lecture's instances
 */
const getBookedLecturesByStudent = function (student) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Lecture.* FROM Lecture
            JOIN Booking ON Booking.lectureId = Lecture.lectureId
            WHERE Booking.studentId = ? AND Booking.status IN (?, ?, ?)
            ORDER BY DATETIME(Lecture.startingDate)`;

        db.all(
            sql,
            [
                student.studentId,
                Booking.BookingType.BOOKED,
                Booking.BookingType.PRESENT,
                Booking.BookingType.NOT_PRESENT,
            ],
            (err, rows) => {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                const lectures = [];
                rows.forEach((row) => lectures.push(Lecture.from(row)));
                resolve(lectures);
            }
        );
    });
};
exports.getBookedLecturesByStudent = getBookedLecturesByStudent;

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
 * get lectures of a course in a specific period of time
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
 * Retrieve a lecture associated to a lectureId
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} a Lecture instance
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
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, `lecture ${lecture.lectureId} not found`));
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
            resolve(res);
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
 * Update a booking status
 * @param {Lecture} lecture - lectureId
 * @param {Student} student - studentId
 * @param {String} status
 * @returns {Promise} num of rows affected
 */
const updateBookingStatus = function (lecture, student, status) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Booking SET status = ? WHERE lectureId = ? AND studentId = ?`;

        db.run(sql, [status, lecture.lectureId, student.studentId], function (err) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(this.changes);
        });
    });
};
exports.updateBookingStatus = updateBookingStatus;

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
 * Return the number of bookings given a lecture
 * The bookings selected are one of those status: BOOKED, PRESENT, or NOT_PRESENT
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} Number
 */
const getNumBookingsOfLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as numBookings FROM Booking WHERE lectureId = ? AND status IN (?, ?, ?)`;

        db.get(
            sql,
            [
                lecture.lectureId,
                Booking.BookingType.BOOKED,
                Booking.BookingType.PRESENT,
                Booking.BookingType.NOT_PRESENT,
            ],
            function (err, res) {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                resolve(res.numBookings);
            }
        );
    });
};
exports.getNumBookingsOfLecture = getNumBookingsOfLecture;

/**
 * Return the number of attendances given a lecture
 * The bookings selected are those with status PRESENT
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} Number
 */
const getNumAttendancesOfLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as numAttendances FROM Booking WHERE lectureId = ? AND status = ?`;

        db.get(sql, [lecture.lectureId, Booking.BookingType.PRESENT], function (err, res) {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(res.numAttendances);
        });
    });
};
exports.getNumAttendancesOfLecture = getNumAttendancesOfLecture;

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
 * @returns {Promise} array of Course's instances
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
                reject(
                    StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, `incorrect lectureId ${lecture.lectureId}`)
                );
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
        db.serialize(async () => {
            db.run("BEGIN TRANSACTION;");

            //db.parallelize(function () {
            //    queries.forEach((query) =>
            //        db.run(query, function (error) {
            //            if (error) {
            //                didError = true;
            //                reject(error);
            //            }
            //        })
            //    );
            //});

            try {
                await wrapQueriesIntoPromises(queries);
                db.run("COMMIT;", () => {
                    resolve();
                });
            } catch (error) {
                db.run("ROLLBACK TRANSACTION;", () => {
                    reject(error);
                });
            }
        });
    });
};
exports.execBatch = execBatch;

/**
 * wrap each query into a promise
 * @param {Array} of String
 * @returns {Promise} promise
 */
async function wrapQueriesIntoPromises(queries) {
    const promises = queries.map((query) => {
        const promise = new Promise((res, rej) => {
            db.run(query, function (error) {
                if (error) {
                    rej(error.toString() + "\n" + query);
                }
                res();
            });
        });
        return promise;
    });

    await Promise.all(promises);
}

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
            if (!row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "Course not found", 404));
                return;
            }
            // console.log('getCourseByCode - row');
            // console.log(row);

            resolve(Course.from(row));
        });
    });
};
exports.getCourseByCode = getCourseByCode;

/**
 * get all students
 * @returns {Promise} array of Student's instances
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
 * @returns {Promise} array of Teacher's instances
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
const getClassByDescription = function (class_) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Class WHERE description = ?`;

        db.get(sql, [class_.description], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }
            if (!row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "Class not found", 404));
                return;
            }

            resolve(Class.from(row));
        });
    });
};
exports.getClassByDescription = getClassByDescription;

/**
 * insert a new lecture into DB
 * @param {Lecture} lecture
 * @returns {Promise} promise of int
 */
const addLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Lecture(courseId, classId, startingDate, duration, bookingDeadline, delivery)
            VALUES(?, ?, DATETIME(?, 'localtime'), ?, DATETIME(?, 'localtime'), ?)`;
            // VALUES(?, ?, DATETIME(?), ?, DATETIME(?), ?)`;
        // console.log("addLecture - inserting a new lecture");
        // console.log(lecture);

        db.run(
            sql,
            [
                lecture.courseId,
                lecture.classId,
                moment(lecture.startingDate).utc().toISOString(),
                lecture.duration,
                moment(lecture.startingDate).utc().toISOString(),
                lecture.delivery,
            ],
            function (err) {
                if (err) {
                    reject(StandardErr.fromDao(err));
                    return;
                }

                resolve(this.changes);
            }
        );
    });
};
exports.addLecture = addLecture;

/**
 * get the list of all calendar periods
 * @returns {Promise} promise of array of Calendar
 */
const _getCalendars = function () {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Calendar`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(rows.map((row) => Calendar.from(row)));
        });
    });
};
exports._getCalendars = _getCalendars;

/**
 * generate a list of valid dates from now to the end of the current period of time
 * these dates are based on the calendar valid periods
 * @param {Schedule} schedule
 * @returns {Promise} promise of array of Dates
 */
const _generateDatesBySchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        _getCalendars()
            .then((calendars) => {
                // adapt for moment usage
                calendars = calendars.map((c) => {
                    c.startingDate = moment(c.startingDate);
                    c.endingDate = moment(c.endingDate);
                    return c;
                });

                // console.log('_generateDatesBySchedule - schedule');
                // console.log(schedule);

                // const gmt_diff = moment().utc().startOf('day').subtract(moment().local().startOf('day'));

                // find the actual academic year
                // const currentAcademicYear = _getCurrentAcademicYear();
                const currentAcademicYear = schedule.AAyear;
                const actualAcademicYearConstraint = calendars
                    .filter((c) => c.type.text === Calendar.CalendarType.ACADEMIC_YEAR.text)
                    .filter((c) => moment(c.startingDate).year() === Number(currentAcademicYear))[0];

                // find the actual semester
                const currentDay = moment();
                const actualSemesterConstraint = calendars
                    .filter((c) => c.type.text === Calendar.CalendarType.SEMESTER.text)
                    .filter((c) => currentDay.isBetween(moment(c.startingDate), moment(c.endingDate), "day", "[]"))[0]; // "[]": include limit dates

                // console.log(actualAcademicYearConstraint);
                // console.log(actualSemesterConstraint);

                if (!(actualAcademicYearConstraint && actualSemesterConstraint)) {
                    reject(
                        StandardErr.new(
                            "Dao",
                            StandardErr.errno.NOT_EXISTS,
                            "The given schedule cannot fit any academic year or semester, unable to generate dates",
                            // "Academic year or semester not defined, unable to generate dates",
                            404
                        )
                    );
                    return;
                }

                // define the list of constraints
                const constraints = [];
                constraints.push(actualAcademicYearConstraint);
                constraints.push(actualSemesterConstraint);
                constraints.push(
                    ...calendars.filter(
                        (c) =>
                            c.type.text !== Calendar.CalendarType.ACADEMIC_YEAR.text &&
                            c.type.text !== Calendar.CalendarType.SEMESTER.text
                    )
                );

                const validDates = [];

                // find the initial date from today
                let nextDate = moment().day(schedule.dayOfWeek).startOf("day"); // start from the first 'dayOfWeek' from today
                if(nextDate.isBefore(moment().startOf("day")))
                    nextDate.add(7, "days").startOf("day");
                // console.log(`_generateDatesBySchedule - init nextDate: ${nextDate}`);
                do {
                    // check constraints
                    const results = constraints.map(
                        // forEach does not generate an array!
                        (c) =>
                            nextDate.isBetween(moment(c.startingDate), moment(c.endingDate), "day", "[]") ===
                            !!c.type.isAValidPeriod
                    ); // include limit dates
                    // "!!val": to boolean

                    // console.log('checking date ' + nextDate.toISOString());
                    // console.log('results');
                    // console.log(results);

                    if (!(results.length >= 2 && !!results[0] && !!results[1]))
                        // academic year or semester have been broken
                        break;

                    if (results.every((r) => r === true)) {
                        // if all constraints have been passed
                        validDates.push(nextDate.clone());
                        // console.log(`_generateDatesBySchedule - valid date found: ${nextDate}`);
                    }

                    // generate next date
                    nextDate.add(7, "days").startOf("day");
                    // nextDate = nextDate.add(7, "days").startOf("day");
                } while (true);

                // console.log(`_generateDatesBySchedule - valid dates generated: ${validDates}`);
                resolve(validDates);
            })
            .catch(reject);
    });
};
exports._generateDatesBySchedule = _generateDatesBySchedule; // export needed for testing

/**
 * remove all lectures given a prototype
 * @param {Schedule} schedule - dayOfWeek needed
 * @returns {Promise} promise of int - number of row changed
 */
const _deleteLecturesBySchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        _generateLecturePrototypeBySchedule(schedule)
            .then((lecturePrototype) => {
                // console.log('_deleteLecturesBySchedule - lecturePrototype');
                // console.log(lecturePrototype);
                // console.log('_deleteLecturesBySchedule - schedule');
                // console.log(schedule);
                // console.log(moment().day(schedule.dayOfWeek).toISOString());
                // console.log(moment(lecturePrototype.startingDate.clone(), 'HH:mm:ss').utc().toISOString());
                // console.log(moment(lecturePrototype.startingDate.clone(), 'HH:mm:ss').utc().toISOString());
        
                const sql = `DELETE FROM Lecture
                    WHERE courseId = ?
                        AND STRFTIME('%w', startingDate) = STRFTIME('%w', DATETIME(?, 'localtime'))
                        AND STRFTIME('%H', startingDate) = STRFTIME('%H', DATETIME(?, 'localtime'))
                        AND STRFTIME('%M', startingDate) = STRFTIME('%M', DATETIME(?, 'localtime'))
                        AND duration = ?
                        AND classId = ?`
        
                db.run(
                    sql,
                    [
                        lecturePrototype.courseId,
                        // moment(lecturePrototype.startingDate).day(),
                        moment().day(schedule.dayOfWeek).toISOString(),
                        moment(lecturePrototype.startingDate, 'HH:mm:ss').utc().toISOString(),
                        moment(lecturePrototype.startingDate, 'HH:mm:ss').utc().toISOString(),
                        lecturePrototype.duration,
                        lecturePrototype.classId
                    ],
                    function (err) {
                        if (err) {
                            reject(StandardErr.fromDao(err));
                            return;
                        }
                        // console.log(`_deleteLecturesBySchedule - rows: ${this.changes}`);
                        // console.log('query params');
                        // console.log([
                        //     lecturePrototype.courseId,
                        //     // moment(lecturePrototype.startingDate).day(),
                        //     moment().day(schedule.dayOfWeek).toISOString(),
                        //     moment(lecturePrototype.startingDate, 'HH:mm:ss').utc().toISOString(),
                        //     moment(lecturePrototype.startingDate, 'HH:mm:ss').utc().toISOString(),
                        //     lecturePrototype.duration,
                        //     lecturePrototype.classId
                        // ]);
                        resolve(this.changes);
                    }
                );
            })
            .catch(reject);
    });
};
exports._deleteLecturesBySchedule = _deleteLecturesBySchedule; // export needed for testing

/**
 * generate all realistic lectures
 * @param {Schedule} schedule
 * @param {Lecture} lecturePrototype
 * @returns {Promise} - promise of Array of Lecture
 */
const _generateLectureByScheduleAndPrototype = function (schedule, lecturePrototype) {
    return new Promise((resolve, reject) => {
        _generateDatesBySchedule(schedule)
            .then((dates) => {
                // console.log(`dates: ${dates}`);
                
                const lecture_init_date = lecturePrototype.startingDate.clone().startOf("day");
                const init_offset = lecturePrototype.startingDate.diff(lecture_init_date);
                const actualStartingDates = dates.map((date) => {
                    let newDate = date.clone().startOf("day").add(init_offset, "ms");
                    newDate.add(date.utcOffset() - newDate.utcOffset(), 'm');
                    // console.log(`starting date: ${date}\t${newDate}`);
                    return newDate;
                });

                const lecture_deadline_date = lecturePrototype.bookingDeadline.clone().startOf("day");
                const deadline_offset = lecturePrototype.bookingDeadline.diff(lecture_deadline_date);
                const day_diff = lecturePrototype.startingDate
                    .clone()
                    .startOf("day")
                    .diff(lecturePrototype.bookingDeadline.clone().startOf("day"), "days");
                const actualBookingDeadlines = dates.map((date) => {
                    let newDate = date.clone().startOf("day").add(deadline_offset, "ms").subtract(day_diff, "days");
                    newDate.subtract(date.utcOffset() - newDate.utcOffset(), 'm');
                    // console.log(`booking deadling: ${date}\t${newDate}`);
                    return newDate;
                });

                // console.log(`actualStartingDates: ${actualStartingDates}`);
                // console.log(`actualBookingDeadlines: ${actualBookingDeadlines}`);

                // now, let's go to generate every single and specific lecture
                const lectures = [];
                for (let i = 0; i < dates.length; i++) {
                    const currLecture = Lecture.from(lecturePrototype); // clone

                    // set specific values for this lecture
                    currLecture.startingDate = actualStartingDates[i];
                    currLecture.bookingDeadline = actualBookingDeadlines[i];

                    lectures.push(currLecture);
                }
                // console.log('_generateLectureByScheduleAndPrototype - lectures');
                // console.log(lectures);
                resolve(lectures);
            })
            .catch(reject);
    });
};
exports._generateLectureByScheduleAndPrototype = _generateLectureByScheduleAndPrototype;

/**
 * generate a list of lectures and insert them into the DB
 * @param {Schedule} schedule
 * @param {Lecture} lecturePrototype
 * @returns {Promise} promise of int - number of inserted lectures
 */
const _addLecturesByScheduleAndPrototype = function (schedule, lecturePrototype) {
    return new Promise((resolve, reject) => {
        _generateLectureByScheduleAndPrototype(schedule, lecturePrototype)
            .then((lectures) => {
                const promises = [];
                for (const lecture of lectures) promises.push(addLecture(lecture));

                Promise.all(promises)
                    .then((values) => {
                        if (values.some((e) => e === 0)) {
                            // if a lecture has not been properly inserted
                            reject(StardardErr.new("Dao", StardardErr.errno.FAILURE, "Unable to insert lectures", 500));
                            return;
                        }
                        resolve(lectures.length); // returns the number of inserted lectures
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};
exports._addLecturesByScheduleAndPrototype = _addLecturesByScheduleAndPrototype; // export needed for testing

/**
 * be sure the class exists
 * @param {Schedule} schedule - roomId, seats needed
 * @returns {Promise} promise of int - changed rows
 */
const _generateClassBySchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Class(description, capacity) VALUES(?, ?)`;
        db.run(sql, [schedule.roomId, schedule.seats], function (err) {
            if (err && !err.errno == 19) {
                // the error is not 'already present'
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(err ? 0 : this.changes); // in case of error, it means the class is already in the DB
        });
    });
};
exports._generateClassBySchedule = _generateClassBySchedule;

/**
 * generate a new course given a schedule
 * @param {Schedule} schedule
 * @returns {Promise} promise of int - changed rows
 */
const _generateCourseBySchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Course(description, year, code, semester) VALUES(?, ?, ?, ?)`;
        db.run(sql, [schedule.code, schedule.AAyear, schedule.code, schedule.semester], function (err) {
            if (err && !err.errno == 19) {
                // the error is not 'already present'
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(err ? 0 : this.changes); // in case of error, it means the course is already in the DB
        });
    });
};
exports._generateCourseBySchedule = _generateCourseBySchedule;

/**
 * generate a lecture prototype given a schedule
 * @param {Schedule} schedule
 * @returns {Promise} promise of Lecture - lecture prototype
 */
const _generateLecturePrototypeBySchedule = function (schedule) {
    return new Promise(async (resolve, reject) => {
        // first of all, get data which are in common for all lectures we are going to generate
        const class_ = new Class();
        class_.description = schedule.roomId;

        await _generateClassBySchedule(schedule);
        Promise.all([
            getClassByDescription(class_),
            // _generateCourseBySchedule(schedule), // removed
            getCourseByCode(schedule.code),
        ])
            .then((values) => {
                // console.log(`values:`);
                // console.log(values);
                const actualClass = values[0];
                const actualCourse = values[1];

                // console.log(`actual schedule: ${schedule.scheduleId}`.cyan);
                // console.log(`actual course: ${actualCourse.courseId}`.cyan);
                // console.log(`actual class: ${actualClass.classId}`.cyan);

                let actualStartingTime;
                let actualEndingTime;

                // console.log("_generateLecturePrototypeBySchedule - actual schedule");
                // console.log(schedule);

                actualStartingTime = moment(schedule.startingTime, "HH:mm");
                actualEndingTime = moment(schedule.endingTime, "HH:mm");

                if (!(actualStartingTime.isValid() && actualEndingTime.isValid())) {
                    reject(StandardErr.new("Dao", StandardErr.errno.UNEXPECTED_VALUE, "Wrong start or end time", 404));
                    return;
                }
                // console.log(actualStartingTime);
                // console.log(actualEndingTime);

                const actualDuration = actualEndingTime.diff(actualStartingTime, "milliseconds"); // in milliseconds
                const bookingDeadlineTime = moment("23:00", "HH:mm").subtract(1, "day"); // by default, the booking deadline is the day before at 23:00

                // build the prototype
                const lecturePrototype = new Lecture();
                lecturePrototype.courseId = actualCourse.courseId;
                lecturePrototype.classId = actualClass.classId;
                lecturePrototype.startingDate = actualStartingTime;
                lecturePrototype.duration = actualDuration;
                lecturePrototype.bookingDeadline = bookingDeadlineTime;
                lecturePrototype.delivery = Lecture.DeliveryType.PRESENCE;

                // TODO: remove these lines
                // console.log("lecturePrototype:");
                // console.log(lecturePrototype);

                resolve(lecturePrototype);
            })
            .catch(reject);
    });
};
exports._generateLecturePrototypeBySchedule = _generateLecturePrototypeBySchedule;

/**
 * generate a list of lecture given a schedule
 * @param {Schedule} schedule
 * @param {DaoHint} hint - optional
 * @param {Schedule} oldSchedule - optional
 * @returns {Promise} promise of bool - true if everything has gone right, false otherwise
 */
const _generateLecturesBySchedule = function (schedule, hint = DaoHint.NO_HINT, oldSchedule = undefined) {
    return new Promise((resolve, reject) => {
        // getScheduleById(schedule)
        _generateLecturePrototypeBySchedule(schedule)
            .then((lecturePrototype) => {
                // let nLectures = 0;

                let promises = [];
                if(!oldSchedule)
                    hint = DaoHint.NEW_VALUE;
                if (hint != DaoHint.NEW_VALUE) promises.push(_deleteLecturesBySchedule(oldSchedule));
                promises.push(_addLecturesByScheduleAndPrototype(schedule, lecturePrototype));

                Promise.all(promises)
                    .then((values) => {
                        let nLectures = values[values.length - 1];
                        resolve(nLectures);
                        return;
                    })
                    .catch((err) => {
                        // maybe the hint was wrong
                        // it can retry a maximum of 1 times
                        promises = [
                            _deleteLecturesBySchedule(oldSchedule),
                            _addLecturesByScheduleAndPrototype(schedule, lecturePrototype),
                        ];
                        Promise.all(promises)
                            .then((values) => {
                                nLectures = values[1];
                                resolve(nLectures);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
            })
            .catch(reject);
    });
};
exports._generateLecturesBySchedule = _generateLecturesBySchedule; // export needed for testing

/**
 * get schedules from the DB
 * @returns {Promise} promise of array of Schedule
 */
const getSchedules = function () {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Schedule`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(rows.map((row) => Schedule.from(row)));
        });
    });
};
exports.getSchedules = getSchedules;

/**
 * update an existing schedule
 * @param {Schedule} schedule
 * @returns {Promise} promise
 */
const updateSchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        // console.log('updateSchedule - schedule as param:');
        // console.log(schedule);

        const sql = `SELECT * FROM Schedule WHERE scheduleId = ?`;

        db.get(sql, [schedule.scheduleId], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }
            const actualSchedule = Schedule.from(row);
            const oldSchedule = Schedule.from(row);

            console.log('updateSchedule - schedule, actualSchedule', oldSchedule);
            console.log(schedule);
            console.log(actualSchedule);
            console.log(oldSchedule);

            // merge objects
            for (const prop in actualSchedule) {
                actualSchedule[prop] = schedule[prop] && schedule[prop] != -1 ? schedule[prop] : actualSchedule[prop]; // assign only not-null properties
            }

            // console.log('updateSchedule - actualSchedule updated');
            // console.log(actualSchedule);

            // actualSchedule.startingTime = moment(actualSchedule.startingTime);
            // actualSchedule.endingDate = moment(actualSchedule.endingDate);

            // console.log(`Updated schedule to insert:`);
            // console.log(actualSchedule);

            const updateSql = `UPDATE Schedule
                SET code = ?,
                    AAyear = ?,
                    semester = ?,
                    roomId = ?,
                    seats = ?,
                    dayOfWeek = ?,
                    startingTime = ?,
                    endingTime = ?
                WHERE scheduleId = ?`;
            const initDate = moment(actualSchedule.startingTime, 'HH:mm');
            const finiDate = moment(actualSchedule.endingTime, 'HH:mm');
            db.run(
                updateSql,
                [
                    actualSchedule.code,
                    actualSchedule.AAyear,
                    actualSchedule.semester,
                    actualSchedule.roomId,
                    actualSchedule.seats,
                    actualSchedule.dayOfWeek,
                    initDate.isValid() ? initDate.format('HH:mm:ss') : '00:00:00',
                    finiDate.isValid() ? finiDate.format('HH:mm:ss') : '00:00:00',
                    actualSchedule.scheduleId,
                ],
                function (err) {
                    if (err) {
                        reject(StandardErr.fromDao(err));
                        return;
                    }

                    if (!this.changes) {
                        reject(
                            StandardErr.new(
                                "Dao",
                                StandardErr.errno.NOT_EXISTS,
                                "Unable to update the schedule, no rows changed",
                                500
                            )
                        );
                        return;
                    }

                    _generateLecturesBySchedule(actualSchedule, DaoHint.ALREADY_PRESENT, oldSchedule).then(resolve).catch(reject);
                }
            );
        });
    });
};
exports.updateSchedule = updateSchedule;

/**
 * get all classe
 * @returns {Promise} promise of list of class
 */
const getClasses = function () {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Class`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }

            resolve(rows.map((row) => Class.from(row)));
        });
    });
};

/**
 * get a schedule from the DB
 * @param {Schedule} schedule - scheduleId needed
 * @returns {Promise} promise of Schedule
 */
const getScheduleById = function (schedule) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Schedule WHERE scheduleId = ?`;

        db.get(sql, [schedule.scheduleId], (err, row) => {
            if (err) {
                reject(StandardErr.fromDao(err));
                return;
            }
            if (!row) {
                reject(StandardErr.new("Dao", StandardErr.errno.NOT_EXISTS, "Schedule not found", 404));
                return;
            }

            resolve(Schedule.from(row));
        });
    });
};
exports.getScheduleById = getScheduleById;

/**
 * build a preview of which data the schedule update will change
 * @param {Schedule} schedule - schedule updates
 * @returns {Promise} Promise of Object - preview
 */
const getUpdateSchedulePreview = function (schedule) {
    return new Promise((resolve, reject) => {
        getScheduleById(schedule) // get the schedule as-is from the DB
            .then(async (currentSchedule) => {
                const actualClass = new Class();
                actualClass.description = currentSchedule.roomId;
                const class_ = new Class();
                class_.description = schedule.roomId;
                Promise.all([
                    // _generateCourseBySchedule(schedule),
                    getCourseByCode(currentSchedule.code),
                    getClassByDescription(actualClass), // currentClass
                    _generateClassBySchedule(schedule),
                    new Promise((innerResolve, innerReject) => {
                        getClassByDescription(class_) // newClass
                            .then(innerResolve)
                            .catch((err) => innerResolve(new Class()));
                    })
                ])
                    .then(async (values) => {
                        const course = values[0];
                        const currentClass = values[1];
                        let newClass = values[3];
                        newClass = newClass.classId > 0 ? newClass : currentClass;

                        // merge objects
                        const newSchedule = new Schedule();
                        for (const prop in newSchedule) {
                            newSchedule[prop] = schedule[prop] && schedule[prop] != -1 ? schedule[prop] : currentSchedule[prop]; // assign only not-null properties
                        }

                        // console.log('getUpdateSchedulePreview - schedule, currentSchedule, newSchedule');
                        // console.log(schedule);
                        // console.log(currentSchedule);
                        // console.log(newSchedule);

                        const currentLectures = await getLecturesByCourse(course); // only future lectures
                        const lecturePrototype = await _generateLecturePrototypeBySchedule(newSchedule);
                        const newLectures = await _generateLectureByScheduleAndPrototype(newSchedule, lecturePrototype); // only future lectures

                        console.log('Lecture old-new mapping...');
                        const lectures = [];
                        for (let i = 0; i < Math.max(currentLectures.length, newLectures.length); i++) {
                            lectures.push({
                                currentLecture: currentLectures[i] || new Lecture(),
                                newLecture: newLectures[i] || new Lecture(),
                            });
                        }

                        // finally, build the preview object
                        console.log('building the preview...');
                        const preview = {
                            schedules: {
                                currentSchedule: currentSchedule,
                                newSchedule: newSchedule,
                            },
                            course: course,
                            classes: {
                                currentClass: currentClass,
                                newClass: newClass,
                            },
                            lectures: lectures,
                        };
                        resolve(preview);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};
exports.getUpdateSchedulePreview = getUpdateSchedulePreview;

exports.getClasses = getClasses;
