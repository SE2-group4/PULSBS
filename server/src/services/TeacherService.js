"use strict";

const Lecture = require("../entities/Lecture");
const Course = require("../entities/Course");
const Teacher = require("../entities/Teacher");
const Student = require("../entities/Student");
const Email = require("../entities/Email");
const utils = require("../utils/utils");
const { ResponseError } = require("../utils/ResponseError");
const check = require("../utils/checker");
const converter = require("../utils/converter");
const EmailService = require("../services/EmailService");
const ManagerService = require("./ManagerService");
const SupportService = require("../services/SupportOfficerService");
const db = require("../db/Dao");

// constants
const MODULE_NAME = "TeacherService";
const ACCEPTED_QUERY_PARAM = ["from", "to", "bookings", "attendances"];
Object.freeze(ACCEPTED_QUERY_PARAM);

const errno = ResponseError.errno;

/**
 * Get all the students that have a booking for a given lecture
 * Only booking with status {BOOKED, PRESENT, NOT_PRESENT} will be considered
 * If set, it will add to each element of the array the property bookingStatus, which tells you in which status the booking is in.
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * withStatus {String} "true" or "false".
 * returns {Promise} array of Student's instances. A ResponseError on error
 **/
exports.teacherGetCourseLectureStudents = async function (teacherId, courseId, lectureId, withStatus = false) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    if (!converter.isValueOfType("boolean", withStatus))
        throw genResponseError(errno.PARAM_NOT_BOOLEAN, { status: withStatus });

    withStatus = converter.toBoolean(withStatus);

    await checkTeacherCorrelations(tId, cId, lId);

    return await db.getBookedStudentsByLecture(new Lecture(lectureId), withStatus);
};

function printQueryParams(bookings, attendances, dateFilter) {
    console.info(`Date filter:       ${JSON.stringify(dateFilter)}`.magenta);
    console.info(`also bookings?:    ${bookings}`.magenta);
    console.info(`also attendances?: ${attendances}`.magenta);
}
/**
 * Retrieve all lectures associated to a course.
 * You can apply a time filter.
 * Date filter:
 * setting a 'from' property will retrieve all lectures with startingDate >= from.<Date>
 * setting a 'to' property will retrieve all lectures with startingDate <= to.<Date>
 *
 * Additional query params:
 * - "bookings": for each lecture it will retrieve the num of bookings (i.e. Bookings.status = { PRESENT, NOT_PRESENT, BOOKED}
 * - "attendances": for each lecture it will retrieve the num of attendances. (i.e. Bookings.status = { PRESENT }
 * Note: the cancelled lectures are not returned.
 *
 * teacherId {Integer}
 * courseId {Integer}
 * queryObj {Object} {from: <date>, to: <date>, bookings = true, attendances = true}
 * returns {Promise} Array of Object's instances. A ResponseError on error.
 **/
exports.teacherGetCourseLectures = async function (teacherId, courseId, queryObj = {}) {
    const { error, teacherId: tId, courseId: cId } = convertToNumbers({ teacherId, courseId });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    let { err, dateFilter = {}, bookings = false, attendances = false } = extractOptions(queryObj);
    if (err instanceof ResponseError) throw err;

    //printQueryParams(bookings, attendances, dateFilter);
    await checkTeacherCorrelations(tId, cId);

    let lectures = await db.getLecturesByCourseAndPeriodOfTime(new Course(cId), dateFilter);
    lectures = ManagerService.addStatsToLectures(lectures, { bookings, attendances });

    return lectures;
};

/**
 * Get all courses taught by a given professor during this academic year
 *
 * teacherId {Integer}
 * returns array of courses. In case of error an ResponseError
 **/
exports.teacherGetCourses = async function (teacherId) {
    const { error, teacherId: tId } = convertToNumbers({ teacherId });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const teacherCourses = await db.getCoursesByTeacher(new Teacher(tId));

    return teacherCourses;
};

/**
 * Retrieve a lecture given a lectureId, courseId, teacherId
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * returns {Lecture}. A ResponseError on error.
 **/
exports.teacherGetCourseLecture = async function (teacherId, courseId, lectureId) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    await checkTeacherCorrelations(tId, cId, lId);

    const retLecture = await db.getLectureById(new Lecture(lId));
    if (!retLecture) {
        throw genResponseError(errno.LECTURE_NOT_FOUND, { lectureId });
    }

    return retLecture;
};

/**
 * Delete a lecture given a lectureId, courseId, teacherId
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * returns {Integer} 204. In case of error an ResponseError
 **/
exports.teacherDeleteCourseLecture = async function (teacherId, courseId, lectureId) {
    return await SupportService.deleteCourseLecture({ teacherId }, courseId, lectureId);
};

/**
 * Update a lecture delivery mode given a lectureId, courseId, teacherId and a switchTo mode
 * You can only switch from PRESENCE to REMOTE. The switch is valid only if the request is sent 30m before the scheduled starting time.
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * switchTo {String}
 * returns {Integer} 204. In case of error an ResponseError
 **/
exports.teacherUpdateCourseLectureDeliveryMode = async function (teacherId, courseId, lectureId, switchTo) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    if (!check.isValidDeliveryMode(switchTo)) {
        throw genResponseError(errno.LECTURE_INVALID_DELIVERY_MODE, { delivery: switchTo });
    }

    await checkTeacherCorrelations(tId, cId, lId);

    const lecture = await db.getLectureById(new Lecture(lId));
    if (!check.isLectureSwitchable(lecture, switchTo, new Date(), true)) {
        throw genResponseError(errno.LECTURE_NOT_SWITCHABLE, { lectureId });
    }

    lecture.delivery = switchTo;
    await db.updateLectureDeliveryMode(lecture);
    const studentsToBeNotified = await db.getBookedStudentsByLecture(lecture);
    if (studentsToBeNotified.length > 0) {
        const course = await db.getCourseByLecture(lecture);
        const subjectArgs = [course.description];
        const messageArgs = [utils.formatDate(lecture.startingDate), lecture.delivery];
        const { subject, message } = EmailService.getDefaultEmail(
            Email.EmailType.LESSON_UPDATE_DELIVERY,
            subjectArgs,
            messageArgs
        );

        studentsToBeNotified.forEach((student) =>
            EmailService.sendCustomMail(student.email, subject, message)
                .then(() => {
                    console.email(
                        `lecture update (${lecture.delivery}, ${utils.formatDate(
                            lecture.startingDate
                        )}) email sent to ${student.email}`
                    );
                })
                .catch((err) => console.error(err))
        );
    }

    return 204;
};

/**
 * Update a booking status
 * Accepted statuses: PRESENT, NOT_PRESENT
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * studentId {Integer}
 * status {String}
 * returns {Integer} 204. A ResponseError on error.
 **/

exports.teacherUpdateCourseLectureStudentStatus = async function (teacherId, courseId, lectureId, studentId, status) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId, studentId: sId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
        studentId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    if (!check.isValidBookingStatus(status)) {
        throw genResponseError(errno.BOOKING_INVALID_STATUS, { status });
    }

    await checkTeacherCorrelations(tId, cId, lId);

    const isUpdatable = await isBookingStatusUpdatable(sId, lId);
    if (!isUpdatable) {
        throw genResponseError(errno.BOOKING_NOT_UPDATABLE, { studentId, lectureId });
    }

    await db.updateBookingStatus(new Lecture(lId), new Student(sId), status.toUpperCase());

    return 204;
};

/**
 * control if params are those in ACCEPTED_QUERY_PARAM
 * @param {Array} of String
 * @returns {Boolean}
 */
function areAcceptableQueryParams(params) {
    for (const param of params) {
        const found = ACCEPTED_QUERY_PARAM.some((elem) => elem === param);
        if (!found) return false;
    }

    return true;
}

/**
 * Extract the options from a query string
 * @param {Object} queryObj. E.g. queryObj = {from: <dateString>, to: <dateString>, bookings: "false", attendances: "true"}
 * @returns {Object} e.g. options = {dateFilter: { from: <new Date()>, to: <new Date()> }, bookings: false }. In case of error returns a ResponseError
 */
function extractOptions(queryObj = {}) {
    if (!(queryObj instanceof Object)) {
        return { err: genResponseError(errno.QUERY_NOT_OBJ, { query: queryObj }) };
    }

    if (Object.keys(queryObj).length === 0) return queryObj;

    if (!areAcceptableQueryParams(Object.keys(queryObj))) {
        return {
            err: genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { params: Object.keys(queryObj) }),
        };
    }

    const options = {};
    for (const key of Object.keys(queryObj)) {
        const value = queryObj[key];
        switch (key) {
            case "from": {
                if (value.toLowerCase() === "inf") break;

                const fromDate = new Date(value);
                if (isNaN(fromDate.getTime())) {
                    return {
                        err: genResponseError(errno.PARAM_NOT_DATE, { date: queryObj[key] }),
                    };
                }

                if (!options.dateFilter) options.dateFilter = {};
                options.dateFilter.from = fromDate;
                break;
            }
            case "to": {
                if (value.toLowerCase() === "inf") break;

                const toDate = new Date(value);
                if (isNaN(toDate.getTime())) {
                    return {
                        err: genResponseError(errno.PARAM_NOT_DATE, { date: queryObj[key] }),
                    };
                }

                if (!options.dateFilter) options.dateFilter = {};
                options.dateFilter.to = toDate;
                break;
            }
            case "bookings": {
                if (!converter.isValueOfType("boolean", value))
                    return {
                        err: genResponseError(errno.PARAM_NOT_BOOLEAN, { bookings: queryObj[key] }),
                    };

                options.bookings = converter.toBoolean(value);
                break;
            }
            case "attendances": {
                if (!converter.isValueOfType("boolean", value))
                    return {
                        err: genResponseError(errno.PARAM_NOT_BOOLEAN, { attendances: queryObj[key] }),
                    };

                options.attendances = converter.toBoolean(value);
                break;
            }
            default:
                console.log("should not be here");
        }
    }

    return options;
}

/**
 * Convert an object's properties values into numbers. E.g. { lectureId: "1", "foo": "3" } will be converted into { lectureId: 1, foo: 3 }
 * In case a property value is NaN, it will return the first property together with its value which is a NaN.
 * @param {Object} custNumbers. E.g. { lectureId: "1", "foo": "3 }
 * @returns {Object} E.g. { lectureId: 1, "foo": 3 }. In case of error an object like { error: { lectureId: foo} }
 */
function convertToNumbers(custNumbers) {
    for (const [name, num] of Object.entries(custNumbers)) {
        if (!isNaN(num)) {
            custNumbers[name] = Number(num);
        } else {
            return { error: { [name]: num } };
        }
    }

    return custNumbers;
}

/**
 * Send daily summaries about the lectures to the teacher in charge of the respective course
 * @param {Object} summaries. E.g. summaries = { 1: {teacher: <Teacher>, course: <Course>, lecture: <Lecture>, studentsBooked: 1}, 2: {...} }
 * @param {Date} requestDateTime
 * @returns none
 */
function sendSummaryToTeachers(summaries) {
    for (let summary of summaries.values()) {
        const teacher = summary.teacher;
        const course = summary.course;
        const lecture = summary.lecture;

        EmailService.sendStudentNumberEmail(
            teacher.email,
            course.description,
            utils.formatDate(lecture.startingDate),
            summary.studentsBooked
        ).then(() =>
            console.email(
                `sent summary to ${teacher.email} about lecture scheduled for ${utils.formatDate(lecture.startingDate)}`
            )
        );

        // TODO: add to the db the email sent
    }
    return;
}

/**
 * Check if a booking.status is updatable
 *
 * studentId {Integer}
 * lectureId {Integer}
 * returns {Boolean}
 **/
async function isBookingStatusUpdatable(studentId, lectureId) {
    let is = false;

    const lectures = await db.getBookedLecturesByStudent(new Student(studentId));

    if (lectures.length > 0) {
        const lecture = lectures.find((l) => l.lectureId === lectureId);

        if (lecture) {
            const now = new Date();
            if (lecture.startingDate.getTime() < now.getTime()) is = true;
        }
    }

    return is;
}

/**
 * Create the summaries of the lectures that have deadline === <date>
 *
 * date {Date | undefined}
 * returns {Array} of summaries. E.g. of a summaries { 1: {lecture: <aLecture>, course: <aCourse>, teacher: <aTeacher>, stundetsBooked: 1}, 2: {...} }. The key is the lectureId.
 **/
async function findSummaryExpiredLectures(date) {
    if (!date) date = new Date();

    const expiredLectures = await db.getLecturesByDeadline(date);

    const mapResponse = new Map();
    let promises = new Map();

    // Get number of stundents for each expiredLectures
    expiredLectures.forEach((lecture) => {
        const promise = db.getBookedStudentsByLecture(lecture);
        promises.set(lecture.lectureId, promise);
        mapResponse.set(lecture.lectureId, { lecture });
    });

    for (let [lectureId, promise] of promises.entries()) {
        const students = await promise;
        let mapValue = mapResponse.get(lectureId);
        mapValue = Object.assign(mapValue, { studentsBooked: students.length });
        mapResponse.set(lectureId, mapValue);
    }

    promises.clear();

    // Associate a course to each expiredLectures
    expiredLectures.forEach((lecture) => {
        const promise = db.getCourseByLecture(lecture);
        promises.set(lecture.lectureId, promise);
    });

    for (let [lectureId, promise] of promises.entries()) {
        const course = await promise;
        let mapValue = mapResponse.get(lectureId);
        mapValue = Object.assign(mapValue, { course });
        mapResponse.set(lectureId, mapValue);
    }

    promises.clear();

    // Associate a teacher to each expiredLectures
    for (let [lectureId, value] of mapResponse.entries()) {
        const promise = db.getTeacherByCourse(new Course(value.course.courseId));
        promises.set(lectureId, promise);
    }

    for (let [lectureId, promise] of promises.entries()) {
        const teacher = await promise;
        let value = mapResponse.get(lectureId);
        value = Object.assign(value, { teacher });
        mapResponse.set(lectureId, value);
    }

    return mapResponse;
}
exports._findSummaryExpiredLectures = findSummaryExpiredLectures;

function genResponseError(nerror, error) {
    return new ResponseError(MODULE_NAME, nerror, error);
}

async function checkTeacherCorrelations(teacherId, courseId, lectureId) {
    let areCorrelated = await check.teacherCourseCorrelation(teacherId, courseId);
    if (!areCorrelated) {
        throw genResponseError(errno.TEACHER_COURSE_MISMATCH_AA, { teacherId, courseId });
    }

    if (lectureId) {
        areCorrelated = await check.courseLectureCorrelation(courseId, lectureId);
        if (!areCorrelated) {
            throw genResponseError(errno.COURSE_LECTURE_MISMATCH_AA, { courseId, lectureId });
        }
    }
}

/**
 * Computes the time difference between the datetime in "now" and the next time it will clock 23:59h
 * If the parameter now is undefined or equal to the string "now", the parameter "now" is assumed to be new Date()
 *
 * nextCheck {Date | "now" | undefined} optional
 * returns {Integer} time in ms. In case of error an ResponseError
 **/
function nextCheck(otherDateTime) {
    if (!otherDateTime || otherDateTime === "now") {
        otherDateTime = new Date();
    }

    const next_at_23_59 = new Date();

    if (otherDateTime.getHours() >= 23 && otherDateTime.getMinutes() >= 59 && otherDateTime.getSeconds() >= 0)
        next_at_23_59.setDate(otherDateTime.getDate() + 1);

    next_at_23_59.setHours(23);
    next_at_23_59.setMinutes(59);
    next_at_23_59.setSeconds(0);
    next_at_23_59.setMilliseconds(0);

    return next_at_23_59.getTime() - otherDateTime.getTime();
}
exports.nextCheck = nextCheck;

/**
 * Check for today's expired lecture and send the summaries to the teachers in charge of the respective course
 **/
async function checkForExpiredLectures() {
    console.info("Checking for lectures that have today as deadline");

    const summaries = await findSummaryExpiredLectures();

    sendSummaryToTeachers(summaries);

    console.info("Emails in queue");

    const time = nextCheck();
    const now = new Date();

    console.info(`Next check scheduled at ${utils.formatDate(new Date(time + now.getTime()))}`);

    setTimeout(() => {
        checkForExpiredLectures();
    }, time);

    return "noerror";
}
exports.checkForExpiredLectures = checkForExpiredLectures;
