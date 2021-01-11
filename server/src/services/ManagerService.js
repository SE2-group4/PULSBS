"use strict";

const Course = require("../entities/Course");
const Lecture = require("../entities/Lecture");
const db = require("../db/Dao");
const { ResponseError } = require("../utils/ResponseError");
const { convertToNumbers, convertToBooleans, isObjectEmpty, isValueOfType } = require("../utils/converter");
const { StandardErr } = require("../utils/utils");
const check = require("../utils/checker");
const Student = require("../entities/Student");

const MODULE_NAME = "ManagerService";
const errno = ResponseError.errno;

const PARAMS = {
    BOOKINGS: "boolean",
    CANCELLATIONS: "boolean",
    ATTENDANCES: "boolean",
};

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

    // check is the course has a lecture with id = lId
    if (!(await check.courseLectureCorrelation(cId, lId))) {
        throw genResponseError(errno.COURSE_LECTURE_MISMATCH_AA, { courseId, lectureId });
    }

    if (!isObjectEmpty(query)) {
        const areValid = areValidParams(query);

        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { params: Object.keys(query) });
    }

    const { bookings, cancellations, attendances } = convertToBooleans(query);

    const lecture = await db.getLectureById(new Lecture(lId));
    const [lectureWithStats] = await addStatsToLectures([lecture], { bookings, cancellations, attendances });

    return lectureWithStats;
};

// a non existing course, returns []
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

        if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { params: Object.keys(query) });
    }

    const { bookings, cancellations, attendances } = convertToBooleans(query);

    const lectures = await db.getLecturesByCourseAndPeriodOfTime(new Course(cId));
    const lectureWithStats = addStatsToLectures(lectures, { bookings, cancellations, attendances });

    return lectureWithStats;
};

exports.managerGetCourses = async function managerGetCourses({ managerId }) {
    const { error } = convertToNumbers({
        managerId,
    });
    if (error) {
        throw genResponseError(errno.PARAM_NOT_INT, error);
    }

    const courses = await db.getAllCourses();

    return courses;
};

async function addStatsToLecture(lecture, { bookings, cancellations, attendances }) {
    const lectureWithStats = Object.assign({}, { lecture });

    if (bookings) {
        lectureWithStats.bookings = await getNumBookingsOfLecture(lecture);
    }

    if (cancellations) {
        lectureWithStats.cancellations = await getNumCancellationsOfLecture(lecture);
    }

    if (attendances) {
        lectureWithStats.attendances = await getNumAttendacesOfLecture(lecture);
    }

    return lectureWithStats;
}

async function getNumBookingsOfLecture(lecture) {
    return await db.getNumBookingsOfLecture(lecture);
}

async function getNumCancellationsOfLecture(lecture) {
    const { count } = await db.getNumBookingsOfLectureByStatus(lecture, "CANCELLED");
    return count;
}

async function getNumAttendacesOfLecture(lecture) {
    return await db.getNumAttendancesOfLecture(lecture);
}

function genResponseError(nerror, error) {
    return new ResponseError(MODULE_NAME, nerror, error);
}

/**
 * check if params contains only accepted params. For a list of valid params, look at PARAMS
 *
 */
function areValidParams(params) {
    for (let [name, type] of Object.entries(params)) {
        name = name.toUpperCase();

        const acceptedType = PARAMS[name];
        if (acceptedType === undefined) return false;

        if (!isValueOfType(acceptedType, type)) {
            return false;
        }
    }

    return true;
}

async function addStatsToLectures(lectures, { bookings, cancellations, attendances }) {
    const lecturesWithStats = await Promise.all(
        lectures.map(async (lecture) => {
            const lectPlusStats = await addStatsToLecture(lecture, { bookings, cancellations, attendances });
            return lectPlusStats;
        })
    );

    return lecturesWithStats;
}
exports.addStatsToLectures = addStatsToLectures;

/**
 * get a student by his SSN or serialNumber
 * @param {*} param
 * @param {*} query
 * @returns {User} user
 */
exports.managerGetStudent = async function managerGetStudent({ managerId }, query = { ssn, serialNumber }) {
    if (query.serialNumber && query.ssn) {
        throw new StandardErr("Manager service", StandardErr.errno.GENERIC, "Both query used (invalid)", 500);
    } else if (query.serialNumber || query.ssn) {
        let student = new Student();
        query.serialNumber ? (student.studentId = Number(query.serialNumber)) : (student.ssn = query.ssn);
        let retUser;
        try {
            retUser = query.serialNumber ? await db.getUserById(student) : await db.getUserBySsn(student);
        } catch (err) {
            throw new StandardErr("Manager service", StandardErr.errno.NOT_EXISTS, "Student not found", 404);
        }
        if (retUser.type === "STUDENT") return retUser;
        else throw new StandardErr("Manager service", StandardErr.errno.NOT_EXISTS, "Student not found", 404);
    } else {
        throw new StandardErr(
            "Manager service",
            StandardErr.errno.GENERIC,
            "No query used (expected at least one)",
            400 
        );
    }
};

/**
 * get the list of students who got a contact with a specific student
 * @param {Object} param - managerId, serialNumber
 * @param {Object} query - date (optional)
 * @returns {Array} array of Student
 */
exports.managerGetReport = async function managerGetReport({ managerId, serialNumber }, { date }) {
    serialNumber = Number(serialNumber);
    date = date ? new Date(date) : new Date();
    const student = new Student(serialNumber);
    const students = await db.managerGetReport(student, date);
    return students;
};
