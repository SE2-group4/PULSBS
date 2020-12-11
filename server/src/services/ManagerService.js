"use strict";

const Course = require("../entities/Course");
const Lecture = require("../entities/Lecture");
const db = require("../db/Dao");
const { ResponseError } = require("../utils/ResponseError");
const errno = ResponseError.errno;

const MODULE_NAME = "ManagerService";

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

    const areValid = areValidParams(query);
    // TODO fix QUERY_PARAM_NOT_ACCEPTER message
    if (!areValid) throw genResponseError(errno.QUERY_PARAM_NOT_ACCEPTED, { todo: "todo" });

    let { bookings, cancellations, attendaces } = query;
    bookings = convertToBoolean(bookings);

    const lectures = await db.getLecturesByCourseAndPeriodOfTime(new Course(cId));

    if (bookings) {
        const lecturesPlusNumBookings = await Promise.all(
            lectures.map(async (lecture) => {
                const numBookings = await db.getNumBookingsOfLecture(lecture);
                return { lecture, numBookings };
            })
        );
        return lecturesPlusNumBookings;
    }

    return lectures;
};

function extractQueryParams(params) {}
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

function convertToBoolean(value) {
    if (value === "true") return true;
    else if (value === "false") return false;
    else return undefined;
}

/**
 */
function areValidParams(params) {
    if (Object.keys(params).length === 0) return true;

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

var statsParams = {
    BOOKINGS: "boolean",
    CANCELLATIONS: "boolean",
    ATTENDACES: "boolean",
};
