"use strict";

const Course = require("../entities/Course");
const Lecture = require("../entities/Lecture");
const db = require("../db/Dao");
const { ResponseError } = require("../utils/ResponseError");

const MODULE_NAME = "ManagerService";
const errno = ResponseError.errno;

// working 
exports.managerGetCourseLecture = async function managerGetCourseLecture(
    { managerId, courseId, lectureId },
    query = {}
) {
    const { error, ...convertedNumbers } = convertToNumbers({
        managerId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const { courseId: cId, lectureId: lId } = convertedNumbers;

    const isAMatch = await isCourseMatchLecture(cId, lId);
    if (!isAMatch) throw genResponseError(errno.COURSE_LECTURE_MISMATCH, { courseId, lectureId });

    if (!isObjectEmpty(query)) {
        const areValid = areValidParams(query);

        // TODO fix QUERY_PARAM_NOT_ACCEPTER message
        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { todo: "todo" });
    }

    const {bookings, cancellations, attendaces} = convertToBooleans(query);

    const lecture = await db.getLectureById(new Lecture(lId));
    const lectureWithStats = addStatsToLecture(lecture, {bookings, cancellations, attendaces});

    return lectureWithStats;
};

// TODO not working
exports.managerGetCourseLectures = async function managerGetCourseLectures(
    { managerId, courseId },
    query = {}
) {
    const { error, ...convertedNumbers } = convertToNumbers({
        managerId,
        courseId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const { courseId: cId } = convertedNumbers;

    if (!isObjectEmpty(query)) {
        const areValid = areValidParams(query);

        // TODO fix QUERY_PARAM_NOT_ACCEPTER message
        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { todo: "todo" });
    }

    const {bookings, cancellations, attendaces} = convertToBooleans(query);

    const lectures = await db.getLecturesByCourse(new Course(cId));
    const lectureWithStats = getStatsForLectures(lectures, {bookings, cancellations, attendaces});

    return lectureWithStats;
};

// TODO not working
exports.managerGetCourse = async function managerGetCourse(
    { managerId, courseId, lectureId },
    query = {}
) {
    const { error, ...convertedNumbers } = convertToNumbers({
        managerId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const { courseId: cId, lectureId: lId } = convertedNumbers;

    const isAMatch = await isCourseMatchLecture(cId, lId);
    if (!isAMatch) throw genResponseError(errno.COURSE_LECTURE_MISMATCH, { courseId, lectureId });

    if (!isObjectEmpty(query)) {
        const areValid = areValidParams(query);

        // TODO fix QUERY_PARAM_NOT_ACCEPTER message
        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { todo: "todo" });
    }

    const {bookings, cancellations, attendaces} = convertToBooleans(query);

    const lecture = await db.getLectureById(new Lecture(lId));
    const lectureWithStats = addStatsToLecture(lecture, {bookings, cancellations, attendaces});

    return lectureWithStats;
};

// TODO not working
exports.managerGetCourses= async function managerGetCourses(
    { managerId, courseId, lectureId },
    query = {}
) {
    const { error, ...convertedNumbers } = convertToNumbers({
        managerId,
        courseId,
        lectureId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const { courseId: cId, lectureId: lId } = convertedNumbers;

    const isAMatch = await isCourseMatchLecture(cId, lId);
    if (!isAMatch) throw genResponseError(errno.COURSE_LECTURE_MISMATCH, { courseId, lectureId });

    if (!isObjectEmpty(query)) {
        const areValid = areValidParams(query);

        // TODO fix QUERY_PARAM_NOT_ACCEPTER message
        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { todo: "todo" });
    }

    const {bookings, cancellations, attendaces} = convertToBooleans(query);

    const lecture = await db.getLectureById(new Lecture(lId));
    const lectureWithStats = addStatsToLecture(lecture, {bookings, cancellations, attendaces});

    return lectureWithStats;
};

async function addStatsToLecture(lecture, {bookings, cancellations, attendaces}) {
    const lectureWithStats = Object.assign({}, {lecture});

    if (bookings) {
        const bookings = await getNumBookingsOfLecture(lecture);
        lectureWithStats.bookings = bookings
    }
    if (cancellations) {
        const cancellations = await getNumCancellationsOfLecture(lecture);
        lectureWithStats.cancellations = cancellations;
    }
    if (attendaces) {
        const attendaces = await getNumAttendacesOfLecture(lecture);
        lectureWithStats.attendaces= attendaces;
    }

    return lectureWithStats;
}

async function getNumBookingsOfLecture(lecture) {
    const numBookings = await db.getNumBookingsOfLecture(lecture);
    return numBookings;
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// TODO
async function getNumCancellationsOfLecture(lecture) {
    return -1;
}

// TODO
async function getNumAttendacesOfLecture(lecture) {
    return -2;
}

async function isCourseMatchLecture(cId, lId) {
    const { count } = await db.checkLectureAndCourse(new Course(cId), new Lecture(lId));
    if (count === 0) return false;
    return true;
}

function genResponseError(errno, error) {
    return new ResponseError(MODULE_NAME, errno, error);
}

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

function convertToBooleans(custBooleans) {
    for (const [name, value] of Object.entries(custBooleans)) {
            custBooleans[name] = convertToBoolean(value);
    }

    return custBooleans;
}

function convertToBoolean(value) {
    if (value === "true") return true;
    else if (value === "false") return false;
    else return undefined;
}

/**
 */
function areValidParams(params) {
    for (let [name, value] of Object.entries(params)) {
        name = name.toUpperCase();

        const acceptedType = statsParams[name];
        if (acceptedType === undefined) return false;

        if (!isValueOfType(acceptedType, value)) {
            return false;
        }
    }

    return true;
}

function isValueOfType(acceptedType, value) {
    const type = acceptedType.toLowerCase();
    switch (type) {
        case "boolean": {
            return isBoolean(value.toLowerCase());
        }
        default: {
            console.log(`${type} not implemented in isValueOfType`);
            return false;
        }
    }
}

function isBoolean(value) {
    return value === "true" || value === "false";
}

async function getStatsForLectures(lectures, {bookings, cancellations, attendaces}) {
    const lecturesWithStats = await Promise.all(lectures.map(async lecture => {
        const lectPlusStats = await addStatsToLecture(lecture, {bookings, cancellations, attendaces});
        return lectPlusStats;
    }));

    return lecturesWithStats;
}

var statsParams = {
    BOOKINGS: "boolean",
    CANCELLATIONS: "boolean",
    ATTENDACES: "boolean",
};
