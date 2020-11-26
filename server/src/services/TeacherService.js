"use strict";

const Lecture = require("../entities/Lecture");
const Course = require("../entities/Course");
const Teacher = require("../entities/Teacher");
const EmailService = require("../services/EmailService");

const { ResponseError } = require("../utils/ResponseError");

const db = require("../db/Dao");

/**
 * Get all the students that have an active booking for a given lecture
 *
 * teacherId Integer
 * courseId Integer
 * lectureId Integer
 * returns array of Students + Booking. In case of error an ResponseError
 **/
exports.teacherGetCourseLectureStudents = async function (teacherId, courseId, lectureId) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    } else if (isNaN(courseId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
    } else if (isNaN(lectureId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { lectureId }, 400);
    }

    const tId = Number(teacherId);
    const cId = Number(courseId);
    const lId = Number(lectureId);

    // checking whether the teacher is in charge of this course during this academic year
    let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);

    if (!isTeachingThisCourse) {
        return new ResponseError(
            "TeacherService",
            ResponseError.TEACHER_COURSE_MISMATCH_AA,
            { courseId, teacherId },
            404
        );
    }

    // checking whether the teacher is in charge of this course during this academic year
    let doesLectureBelong = await doesLectureBelongToCourse(cId, lId);

    if (!doesLectureBelong) {
        return new ResponseError(
            "TeacherService",
            ResponseError.COURSE_LECTURE_MISMATCH_AA,
            { lectureId, courseId },
            404
        );
    }

    try {
        const lecture = new Lecture(lId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder
        const lectureStudents = await db.getStudentsByLecture(lecture);
        return lectureStudents;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

/**
 * Get all lectures given a course and a teacher.
 * You can filter the lecture by passing an query string.
 * If the query string is missing, the function will return all lectures scheduled from today
 * Otherwise is a 'from' property is passed, it will return all lectures that have startingDate >= from
 * Similarly for 'to' property
 *
 * teacherId {Integer}
 * courseId {Integer}
 * queryFilter {Object} 
 * returns array of lectures. In case of error an ResponseError
 **/
exports.teacherGetCourseLectures = async function (teacherId, courseId, queryFilter) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    } else if (isNaN(courseId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
    }

    let dateFilter = extractDateFilters(queryFilter);
    if (dateFilter instanceof ResponseError) return dateFilter;
    else if (!dateFilter.from && !dateFilter.to) dateFilter.from = new Date();

    console.log("GET COURSE LECTURE: date filter", dateFilter);

    const tId = Number(teacherId);
    const cId = Number(courseId);

    // checking whether the teacher is in charge of this course during this academic year
    let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);

    if (!isTeachingThisCourse) {
        return new ResponseError(
            "TeacherService",
            ResponseError.TEACHER_COURSE_MISMATCH_AA,
            { courseId, teacherId },
            404
        );
    }

    try {
        // I put the other fields in as a reminder
        const course = new Course(cId, undefined, undefined);
        const courseLectures = await db.getLecturesByPeriodOfTime(course, dateFilter);
        return courseLectures;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

/**
 * Get all courses taught in this academic year by a given professor
 *
 * teacherId Integer
 * returns array of courses. In case of error an ResponseError
 **/
exports.teacherGetCourses = async function (teacherId) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    }

    const tId = Number(teacherId);
    const teacher = new Teacher(tId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder

    try {
        const teacherCourses = await db.getCoursesByTeacher(teacher);
        return teacherCourses;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

/**
 * Check whether a teacher is in charge of a course during this academic year
 *
 * teacherId Integer
 * courseId Integer
 * returns boolean
 **/
const isCourseTaughtBy = async (teacherId, courseId) => {
    let isTeachingThisCourse = false;

    const teacherCourses = await db.getCoursesByTeacher(
        new Teacher(teacherId, undefined, undefined, undefined, undefined)
    );

    if (teacherCourses.length > 0) {
        isTeachingThisCourse = teacherCourses.some((course) => course.courseId === courseId);
    }

    return isTeachingThisCourse;
};

/**
 * Check whether this lecture belongs to this course
 *
 * courseId Integer
 * lectureId Integer
 * returns boolean
 **/
const doesLectureBelongToCourse = async (courseId, lectureId) => {
    let doesBelong = false;

    const courseLectures = await db.getLecturesByCourse(new Course(courseId, undefined, undefined));

    if (courseLectures.length > 0) {
        doesBelong = courseLectures.some((lecture) => lecture.lectureId === lectureId);
    }

    return doesBelong;
};

const nextCheck = (now) => {
    if (!now || now === "now") now = new Date();

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

exports.checkForExpiredLectures = async () => {
    console.log("AUTORUN: Checking for expired lectures");
    const summaries = await findSummaryExpiredLectures();
    sendSummaryToTeachers(summaries);
    console.log("AUTORUN: Emails in queue");
    const time = nextCheck();
    const now = new Date();
    console.log(`AUTORUN: Next check planned for ${new Date(time + now.getTime())}`);

    setTimeout(() => {
        this.checkForExpiredLectures();
    }, time);
};

const findSummaryExpiredLectures = async (date) => {
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
};

const sendSummaryToTeachers = (summaries) => {
    for (let [lectureId, summary] of summaries.entries()) {
        const teacher = summary.teacher;
        const course = summary.course;
        const lecture = summary.lecture;

        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            timeZone: "Europe/Rome",
        };
        const dateFormatter = new Intl.DateTimeFormat("en-GB", options);

        EmailService.sendStudentNumberEmail(
            teacher.email,
            course.description,
            dateFormatter.format(lecture.startingDate),
            summary.studentsBooked
        ).then(() => console.log(`sent email to ${teacher.email} about lecture ${lectureId}`));

        // TODO: add to the db the email sent
    }
    return;
};

// TODO: add support for 'from' and 'to' query string
exports.teacherGetCourseLecture = async function (teacherId, courseId, lectureId) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    } else if (isNaN(courseId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
    } else if (isNaN(lectureId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { lectureId }, 400);
    }

    const tId = Number(teacherId);
    const cId = Number(courseId);
    const lId = Number(lectureId);

    // checking whether the teacher is in charge of this course during this academic year
    let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);
    if (!isTeachingThisCourse) {
        return new ResponseError(
            "TeacherService",
            ResponseError.TEACHER_COURSE_MISMATCH_AA,
            { courseId, teacherId },
            404
        );
    }

    // checking whether the teacher is in charge of this course during this academic year
    let doesLectureBelong = await doesLectureBelongToCourse(cId, lId);
    if (!doesLectureBelong) {
        return new ResponseError(
            "TeacherService",
            ResponseError.COURSE_LECTURE_MISMATCH_AA,
            { lectureId, courseId },
            404
        );
    }

    try {
        const lecture = new Lecture(lId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder
        const retLecture = await db.getLectureById(lecture);

        if (!retLecture) {
            return new ResponseError("TeacherService", ResponseError.LECTURE_NOT_FOUND, { lectureId }, 404);
        }

        return retLecture;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

exports.teacherDeleteCourseLecture = async function (teacherId, courseId, lectureId) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    } else if (isNaN(courseId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
    } else if (isNaN(lectureId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { lectureId }, 400);
    }

    const tId = Number(teacherId);
    const cId = Number(courseId);
    const lId = Number(lectureId);

    // checking whether the teacher is in charge of this course during this academic year
    let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);
    if (!isTeachingThisCourse) {
        return new ResponseError(
            "TeacherService",
            ResponseError.TEACHER_COURSE_MISMATCH_AA,
            { courseId, teacherId },
            404
        );
    }

    // checking whether the teacher is in charge of this course during this academic year
    let doesLecture = await doesLectureBelongToCourse(cId, lId);
    if (!doesLecture) {
        return new ResponseError(
            "TeacherService",
            ResponseError.COURSE_LECTURE_MISMATCH_AA,
            { lectureId, courseId },
            404
        );
    }

    try {
        const lecture = new Lecture(lId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder
        const retVal = await db.deleteLecture(lecture);
        if (!retVal) {
            return new ResponseError(
                "TeacherService",
                ResponseError.LECTURE_NOT_FOUND,
                { lectureId: lecture.lectureId },
                404
            );
        }

        return 204;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

// TODO: add error when switching from the same state
exports.teacherUpdateCourseLectureDeliveryMode = async function (teacherId, courseId, lectureId, switchTo) {
    if (isNaN(teacherId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
    } else if (isNaN(courseId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
    } else if (isNaN(lectureId)) {
        return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { lectureId }, 400);
    }

    if (
        switchTo.toUpperCase() !== Lecture.DeliveryType.PRESENCE &&
        switchTo.toUpperCase() !== Lecture.DeliveryType.REMOTE
    ) {
        return new ResponseError(
            "TeacherService",
            ResponseError.LECTURE_INVALID_DELIVERY_MODE,
            { delivery: switchTo },
            400
        );
    }

    const tId = Number(teacherId);
    const cId = Number(courseId);
    const lId = Number(lectureId);

    // checking whether the teacher is in charge of this course during this academic year
    let isTeachingThisCourse = await isCourseTaughtBy(tId, cId);
    if (!isTeachingThisCourse) {
        return new ResponseError(
            "TeacherService",
            ResponseError.TEACHER_COURSE_MISMATCH_AA,
            { courseId, teacherId },
            404
        );
    }

    // checking whether the teacher is in charge of this course during this academic year
    let doesLecture = await doesLectureBelongToCourse(cId, lId);
    if (!doesLecture) {
        return new ResponseError(
            "TeacherService",
            ResponseError.COURSE_LECTURE_MISMATCH_AA,
            { lectureId, courseId },
            404
        );
    }

    // TODO: add a check that we are not switching from to the same delivery mode
    try {
        const lecture = new Lecture(lId, undefined, undefined, undefined, undefined, undefined, switchTo); // I also put the other fields in as a reminder
        const retVal = await db.updateLectureDeliveryMode(lecture);
        if (!retVal) {
            return 400;
        }

        return 204;
    } catch (err) {
        return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
    }
};

function extractDateFilters(queryString) {
    if (!(queryString instanceof Object)) {
        return {};
    }

    const dateFilter = {};
    for (const key of Object.keys(queryString)) {
        switch (key) {
            case "from": {
                const fromDate = new Date(queryString[key]);
                if (isNaN(fromDate.getTime())) {
                    console.log("INVALID");
                    return new ResponseError(
                        "TeacherService",
                        ResponseError.PARAM_NOT_DATE,
                        { date: queryString[key] },
                        400
                    );
                }

                dateFilter.from = fromDate;
                break;
            }
            case "to": {
                const toDate = new Date(queryString[key]);
                if (isNaN(toDate.getTime())) {
                    return new ResponseError(
                        "TeacherService",
                        ResponseError.PARAM_NOT_DATE,
                        { date: queryString[key] },
                        400
                    );
                }

                dateFilter.to = toDate;
                break;
            }
            default:
                return new ResponseError("TeacherService", ResponseError.QUERY_PARAM_NOT_ACCEPTED, { param: key }, 400);
        }
    }

    return dateFilter;
}
