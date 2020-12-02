"use strict";

const Lecture = require("../entities/Lecture");
const Course = require("../entities/Course");
const Teacher = require("../entities/Teacher");
const Email = require("../entities/Email");
const EmailService = require("../services/EmailService");
const utils = require("../utils/utils");
const { ResponseError } = require("../utils/ResponseError");

const db = require("../db/Dao");
const colors = require("colors");

/**
 * Get all the students that have an active booking for a given lecture
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * returns an array of Students. In case of error a ResponseError message
 **/
exports.teacherGetCourseLectureStudents = async function (teacherId, courseId, lectureId) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    try {
        // checking if the teacher is in charge of this course during this academic year
        const isTaughtBy = await isCourseTaughtBy(tId, cId);
        if (!isTaughtBy) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.TEACHER_COURSE_MISMATCH_AA,
                { courseId, teacherId },
                404
            );
        }

        // checking if the lecture is associated to this course
        const doesLectureBelong = await doesLectureBelongToCourse(cId, lId);
        if (!doesLectureBelong) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.COURSE_LECTURE_MISMATCH_AA,
                { lectureId, courseId },
                404
            );
        }

        const lecture = new Lecture(lId);
        const lectureStudents = await db.getStudentsByLecture(lecture);

        return lectureStudents;
    } catch (err) {
        throw err;
        //if (err instanceof ResponseError) throw err;
        //throw new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

/**
 * Retrieve all the lectures related to a course.
 * You can filter the lecture by passing a query string.
 * If the query string is missing, the function will return all lectures of the course.
 * Otherwise if a 'from' property is passed, it will return all lectures with startingDate >= from.fromDate
 * Similarly, 'to' will return all lectures with startingDate <= to.fromDate
 * The cancelled lectures are not returned.
 *
 * teacherId {Integer}
 * courseId {Integer}
 * queryString {Object} {from: <date>, to: <date>, numBookinks = true}
 * returns {Array} array of lectures. In case of error an ResponseError
 **/
exports.teacherGetCourseLectures = async function (teacherId, courseId, queryString) {
    const { error, teacherId: tId, courseId: cId } = convertToNumbers({ teacherId, courseId });
    if (error) {
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    let { err, dateFilter, numBookings } = extractOptions(queryString);
    if (err instanceof ResponseError) throw err;

    if (!dateFilter) dateFilter = {};

    console.log(
        `Date filter:     ${Object.keys(dateFilter).length === 0 ? "no filter" : JSON.stringify(dateFilter)}`.magenta
    );
    console.log(`Num of bookings: ${numBookings === undefined ? false : numBookings}`.magenta);

    try {
        // check if the teacher is in charge of this course during this academic year
        let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);
        if (!isTeachingThisCourse) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.TEACHER_COURSE_MISMATCH_AA,
                { courseId, teacherId },
                404
            );
        }

        const course = new Course(cId);
        const courseLectures = await db.getLecturesByCourseAndPeriodOfTime(course, dateFilter);
        if (!numBookings) return courseLectures;

        let lecturesPlusNumBookings = await Promise.all(
            courseLectures.map(async (lecture) => {
                const totBookings = await db.getNumBookingsOfLecture(lecture);
                return { lecture, numBookings: totBookings };
            })
        );

        return lecturesPlusNumBookings;
    } catch (genError) {
        //return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, genError, 500);
        throw genError;
    }
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
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    try {
        const teacher = new Teacher(tId);
        const teacherCourses = await db.getCoursesByTeacher(teacher);

        return teacherCourses;
    } catch (err) {
        //throw new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
        throw err;
    }
};

/**
 * Computes the time difference between the datetime in "now" and the next time it will clock 23:59h
 * If the parameter now is undefined or equal to the string "now", the parameter "now" is assumed to be new Date()
 *
 * nextCheck {Date | "now" | undefined} optional
 * returns {Integer} time in ms. In case of error an ResponseError
 **/
const nextCheck = (now) => {
    if (!now || now === "now") {
        now = new Date();
    }

    const next_at_23_59 = new Date();
    if (now.getHours() >= 23 && now.getMinutes() >= 59 && now.getSeconds() >= 0)
        next_at_23_59.setDate(next_at_23_59.getDate() + 1);

    next_at_23_59.setHours(23);
    next_at_23_59.setMinutes(59);
    next_at_23_59.setSeconds(0);
    next_at_23_59.setMilliseconds(0);

    return next_at_23_59.getTime() - now.getTime();
};
exports.nextCheck = nextCheck;

/**
 * Check for today's expired lecture and send the summaries to the teachers in charge of the respective course
 **/
exports.checkForExpiredLectures = async () => {
    console.info("Checking for lectures that have today as deadline");

    const summaries = await findSummaryExpiredLectures();

    sendSummaryToTeachers(summaries);

    console.info("Emails in queue");

    const time = nextCheck();
    const now = new Date();

    console.info(`Next check scheduled at ${utils.formatDate(new Date(time + now.getTime()))}`);

    setTimeout(() => {
        this.checkForExpiredLectures();
    }, time);

    return "noerror";
};

/**
 * Retrieve a lecture given a lectureId, courseId, teacherId
 *
 * teacherId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * returns {Lecture} a lecture. In case of error an ResponseError
 **/
exports.teacherGetCourseLecture = async function (teacherId, courseId, lectureId) {
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    try {
        // checking if the teacher is in charge of this course during this academic year
        const isTaughtBy = await isCourseTaughtBy(tId, cId);
        if (!isTaughtBy) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.TEACHER_COURSE_MISMATCH_AA,
                { courseId, teacherId },
                404
            );
        }

        // checking if the lecture belongs to this course
        const doesLectureBelong = await doesLectureBelongToCourse(cId, lId);
        if (!doesLectureBelong) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.COURSE_LECTURE_MISMATCH_AA,
                { lectureId, courseId },
                404
            );
        }

        const lecture = new Lecture(lId);
        const retLecture = await db.getLectureById(lecture);
        if (!retLecture) {
            throw new ResponseError("TeacherService", ResponseError.LECTURE_NOT_FOUND, { lectureId }, 404);
        }

        return retLecture;
    } catch (err) {
        //throw new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
        throw err;
    }
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
    const { error, teacherId: tId, courseId: cId, lectureId: lId } = convertToNumbers({
        teacherId,
        courseId,
        lectureId,
    });
    if (error) {
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    try {
        // checking if the teacher is in charge of this course during this academic year
        const isTaughtBy = await isCourseTaughtBy(tId, cId);
        if (!isTaughtBy) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.TEACHER_COURSE_MISMATCH_AA,
                { courseId, teacherId },
                404
            );
        }

        // checking if the lecture belongs to this course
        const doesLectureBelong = await doesLectureBelongToCourse(cId, lId);

        if (!doesLectureBelong) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.COURSE_LECTURE_MISMATCH_AA,
                { lectureId, courseId },
                404
            );
        }

        let lecture = new Lecture(lId);
        lecture = await db.getLectureById(lecture);

        if (isLectureCancellable(lecture)) {
            const isSuccess = await db.deleteLectureById(lecture);
            if (isSuccess > 0) {
                const emailsToBeSent = await db.getEmailsInQueueByEmailType(Email.EmailType.LESSON_CANCELLED);

                if (emailsToBeSent.length > 0) {
                    const aEmail = emailsToBeSent[0];
                    const subjectArgs = [aEmail.courseName];
                    const messageArgs = [aEmail.startingDate];
                    const { subject, message } = EmailService.getDefaultEmail(
                        Email.EmailType.LESSON_CANCELLED,
                        subjectArgs,
                        messageArgs
                    );

                    emailsToBeSent.forEach((email) =>
                        EmailService.sendCustomMail(email.recipient, subject, message)
                            .then(() => {
                                console.log("CANCELLATION email sent to " + email.recipient);
                                db.deleteEmailQueueById(email);
                            })
                            .catch((err) => console.error(err))
                    );
                }
            }
        } else {
            throw new ResponseError(
                "TeacherService",
                ResponseError.LECTURE_NOT_CANCELLABLE,
                { lectureId: lecture.lectureId },
                409
            );
        }

        return 204;
    } catch (err) {
        throw err;
        //throw new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
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
        throw new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, error, 400);
    }

    if (!isValidDeliveryMode(switchTo)) {
        throw new ResponseError(
            "TeacherService",
            ResponseError.LECTURE_INVALID_DELIVERY_MODE,
            { delivery: switchTo },
            400
        );
    }

    try {
        // checking if the teacher is in charge of this course during this academic year
        const isTaughtBy = await isCourseTaughtBy(tId, cId);
        if (!isTaughtBy) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.TEACHER_COURSE_MISMATCH_AA,
                { courseId, teacherId },
                404
            );
        }

        // checking if the lecture belongs to this course
        const doesLectureBelong = await doesLectureBelongToCourse(cId, lId);
        if (!doesLectureBelong) {
            throw new ResponseError(
                "TeacherService",
                ResponseError.COURSE_LECTURE_MISMATCH_AA,
                { lectureId, courseId },
                404
            );
        }

        const lecture = await db.getLectureById(new Lecture(lId));
        if (!isLectureSwitchable(lecture, new Date(), switchTo)) {
            throw new ResponseError("TeacherService", ResponseError.LECTURE_NOT_SWITCHABLE, { lectureId }, 404);
        }

        lecture.delivery = switchTo;
        await db.updateLectureDeliveryMode(lecture);
        const studentsToBeNotified = await db.getStudentsByLecture(lecture);
        if (studentsToBeNotified.length > 0) {
            const course = await db.getCourseByLecture(lecture);
            const subjectArgs = [course.description];
            const messageArgs = [lecture.startingDate, lecture.delivery];
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
    } catch (err) {
        //throw new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
        throw err;
    }
};

/**
 * Extract the options from a query string
 * @param {Object} queryString. E.g. queryString = {from: <dateString>, to: <dateString>, numBookings: "false"}
 * @returns {Object} e.g. options = {dateFilter: { from: <new Date()>, to: <new Date()> }, numBookings: false }. In case of error returns a ResponseError
 */
function extractOptions(queryString) {
    if (!(queryString instanceof Object) || Object.keys(queryString).length === 0) {
        return {};
    }

    const options = {};
    for (const key of Object.keys(queryString)) {
        const value = queryString[key];
        switch (key) {
            case "from": {
                if (value.toLowerCase() === "inf") break;

                const fromDate = new Date(value);
                if (isNaN(fromDate.getTime())) {
                    return {
                        err: new ResponseError(
                            "TeacherService",
                            ResponseError.PARAM_NOT_DATE,
                            { date: queryString[key] },
                            400
                        ),
                    };
                }

                if (isObjEmpty(options.dateFilter)) options.dateFilter = {};
                options.dateFilter.from = fromDate;
                break;
            }
            case "to": {
                if (value.toLowerCase() === "inf") break;

                const toDate = new Date(value);
                if (isNaN(toDate.getTime())) {
                    return {
                        err: new ResponseError(
                            "TeacherService",
                            ResponseError.PARAM_NOT_DATE,
                            { date: queryString[key] },
                            400
                        ),
                    };
                }

                if (isObjEmpty(options.dateFilter)) options.dateFilter = {};
                options.dateFilter.to = toDate;
                break;
            }
            case "numBookings": {
                if (value !== "false" && value !== "true") {
                    return {
                        err: new ResponseError(
                            "TeacherService",
                            ResponseError.PARAM_NOT_BOOLEAN,
                            { numBookings: queryString[key] },
                            400
                        ),
                    };
                }

                options.numBookings = value === "false" ? false : true;
                break;
            }
            default:
                return new ResponseError("TeacherService", ResponseError.QUERY_PARAM_NOT_ACCEPTED, { param: key }, 400);
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
 * Check if a lecture is cancellable.
 * A lecture is cancellable if the request is sent 1h before the scheduled starting time of a lecture
 * @param {Lecture} lecture
 * @param {Date} requestDateTime
 * @returns {Boolean}
 */
function isLectureCancellable(lecture, requestDateTime) {
    if (!requestDateTime) requestDateTime = new Date();

    const lectTime = lecture.startingDate.getTime();
    const cancelTime = requestDateTime.getTime();
    const minDiffAllowed = 60 * 60 * 1000;

    if (lectTime - cancelTime > minDiffAllowed) {
        return true;
    }

    return false;
}

/**
 * Check if a lecture is switchable.
 * A lecture is switchable if the request is sent 30m before the scheduled starting time of a lecture and only from PRESENCE to REMOTE
 * @param {Lecture} lecture
 * @param {Date} requestDateTime
 * @returns {Boolean}
 */
function isLectureSwitchable(lecture, requestDateTime, newMode) {
    if (newMode.toUpperCase() === Lecture.DeliveryType.PRESENCE || lecture.delivery === Lecture.DeliveryType.REMOTE) {
        return false;
    }

    if (!requestDateTime) requestDateTime = new Date();

    const lectTime = lecture.startingDate.getTime();
    const switchTime = requestDateTime.getTime();
    const minDiffAllowed = 30 * 60 * 1000;

    if (lectTime - switchTime > minDiffAllowed) {
        return true;
    }

    return false;
}

/**
 * Check if the switchTo is a valid delivery mode
 * @param {String} switchTo
 * @returns {Boolean}
 */
function isValidDeliveryMode(switchTo) {
    if (!switchTo) return false;

    if (
        switchTo.toUpperCase() === Lecture.DeliveryType.PRESENCE ||
        switchTo.toUpperCase() === Lecture.DeliveryType.REMOTE
    ) {
        return true;
    }

    return false;
}

/**
 * Send daily summaries about the lectures that have today as deadline to the teacher in charge of the respective course
 * @param {Object} summaries. E.g. summaries = { 1: {teacher: <Teacher>, course: <Course>, lecture: <Lecture>, studentsBooked: 1}, 2: {...} }
 * @param {Date} requestDateTime
 * @returns none
 */
function sendSummaryToTeachers(summaries) {
    for (let [lectureId, summary] of summaries.entries()) {
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
 * Check if teacherId is in charge of courseId during this academic year
 *
 * teacherId {Integer}
 * courseId {Integer}
 * returns {Boolean}
 **/
async function isCourseTaughtBy(teacherId, courseId) {
    let isTeachingThisCourse = false;

    const teacherCourses = await db.getCoursesByTeacher(new Teacher(teacherId));
    if (teacherCourses.length > 0) {
        isTeachingThisCourse = teacherCourses.some((course) => course.courseId === courseId);
    }

    return isTeachingThisCourse;
}

/**
 * Check if lectureId belongs to courseId
 *
 * courseId {Integer}
 * lectureId {Integer}
 * returns {Boolean}
 **/
async function doesLectureBelongToCourse(courseId, lectureId) {
    let doesBelong = false;

    const courseLectures = await db.getLecturesByCourseId(new Course(courseId));
    if (courseLectures.length > 0) {
        doesBelong = courseLectures.some((lecture) => lecture.lectureId === lectureId);
    }

    return doesBelong;
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
        const promise = db.getStudentsByLecture(lecture);
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

function isObjEmpty(obj) {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
}
