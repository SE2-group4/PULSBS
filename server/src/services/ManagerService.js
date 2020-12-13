"use strict";

const Course = require("../entities/Course");
const Lecture = require("../entities/Lecture");
const db = require("../db/Dao");
const { ResponseError } = require("../utils/ResponseError");
const { convertToNumbers, convertToBooleans } = require("../utils/converter");
const Student = require("../entities/Student");

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

    const { bookings, cancellations, attendaces } = convertToBooleans(query);

    const lecture = await db.getLectureById(new Lecture(lId));
    const lectureWithStats = addStatsToLecture(lecture, { bookings, cancellations, attendaces });

    return lectureWithStats;
};

exports.managerGetCourseLectures = async function managerGetCourseLectures({ managerId, courseId }, query = {}) {
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

    const { bookings, cancellations, attendaces } = convertToBooleans(query);

    const lectures = await db.getLecturesByCourse(new Course(cId));
    const lectureWithStats = getStatsForLectures(lectures, { bookings, cancellations, attendaces });

    return lectureWithStats;
};

exports.managerGetCourses = async function managerGetCourses({ managerId }, query = {}) {
    const { error } = convertToNumbers({
        managerId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const courses = await db.getAllCourses();

    const coursesWithLectures = {};

    await Promise.all(
        courses.map(async (course) => {
            const copyQuery = Object.assign({}, query);
            const lecturesPlusStats = await exports.managerGetCourseLectures(
                { managerId, courseId: course.courseId },
                copyQuery
            );
            coursesWithLectures[course.courseId] = lecturesPlusStats;
        })
    );

    return coursesWithLectures;
};

async function addStatsToLecture(lecture, { bookings, cancellations, attendaces }) {
    const lectureWithStats = Object.assign({}, { lecture });

    if (bookings) {
        const bookings = await getNumBookingsOfLecture(lecture);
        lectureWithStats.bookings = bookings;
    }
    if (cancellations) {
        const cancellations = await getNumCancellationsOfLecture(lecture);
        lectureWithStats.cancellations = cancellations;
    }
    if (attendaces) {
        const attendaces = await getNumAttendacesOfLecture(lecture);
        lectureWithStats.attendaces = attendaces;
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

async function getStatsForLectures(lectures, { bookings, cancellations, attendaces }) {
    const lecturesWithStats = await Promise.all(
        lectures.map(async (lecture) => {
            const lectPlusStats = await addStatsToLecture(lecture, { bookings, cancellations, attendaces });
            return lectPlusStats;
        })
    );

    return lecturesWithStats;
}

var statsParams = {
    BOOKINGS: "boolean",
    CANCELLATIONS: "boolean",
    ATTENDACES: "boolean",
};

async function managerGetStudent({ managerId }, query = { ssn, serialNumber }) {

}

/**
 * get the list of students who got a contact with a specific student
 * @param {Object} param - managerId, serialNumber
 * @param {Object} query - data (optional)
 */
async function managerGetReport({ managerId, serialNumber }, query) {
    managerId = Number(managerId);
    serialNumber = Number(serialNumber);
    date = query.date ? new Date(query.date) : query.date;

    const student = new Student(serialNumber);
    const students = await db.trackContacts(student, date);
    return students;
}