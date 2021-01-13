"use strict";

/**
 * wrapper for an error message
 * @param {String} source
 * @param {Integer} errno
 * @param {Object} message error arguments. See getErrorMessage
 * @param {Number} statusCode
 */

const defaultStatusCode = {
    BOOKING_INVALID_STATUS: 400,
    BOOKING_NOT_PRESENT: 404,
    BOOKING_NOT_UPDATABLE: 400,
    COURSE_NOT_ENROLLED_AA: 400,
    COURSE_LECTURE_MISMATCH_AA: 404,
    DB_GENERIC_ERROR: 500,
    DB_SQLITE_CONSTRAINT_FAILED: 409,
    LECTURE_GIVEN: 400,
    LECTURE_NOT_FOUND: 404,
    LECTURE_INVALID_DELIVERY_MODE: 400,
    LECTURE_NOT_CANCELLABLE: 409,
    LECTURE_NOT_SWITCHABLE: 409,
    PARAM_NOT_BOOLEAN: 400,
    PARAM_NOT_DATE: 400,
    PARAM_NOT_INT: 400,
    QUERY_PARAM_NOT_ACCEPTED: 400,
    QUERY_PARAM_NOT_VALUE_ACCEPTED: 400,
    ENTITY_TYPE_NOT_VALID: 400,
    ENTITY_NOT_FOUND: 404,
    FILE_INCORRECT_FORMAT: 400,
    FILE_MISSING: 400,
    TEACHER_COURSE_MISMATCH_AA: 404,
    ROUTE_FORBIDDEN: 401,
};

class ResponseError {
    constructor(source, errno, msgArgs, statusCode) {
        let code = statusCode;
        if (code === undefined) code = ResponseError.getDefaultStatusCode(errno);

        this.payload = {
            source: source,
            errno: errno,
            message: ResponseError.getErrorMessage(errno, msgArgs),
            statusCode: code,
        };
        this.statusCode = code;
    }

    static errno = {
        BOOKING_INVALID_STATUS: 50,
        BOOKING_NOT_PRESENT: 51,
        BOOKING_NOT_UPDATABLE: 52,
        COURSE_NOT_ENROLLED_AA: 10,
        COURSE_LECTURE_MISMATCH_AA: 11,
        DB_GENERIC_ERROR: 40,
        DB_SQLITE_CONSTRAINT_FAILED: 41,
        LECTURE_GIVEN: 20,
        LECTURE_NOT_FOUND: 21,
        LECTURE_INVALID_DELIVERY_MODE: 22,
        LECTURE_NOT_CANCELLABLE: 23,
        LECTURE_NOT_SWITCHABLE: 24,
        PARAM_NOT_BOOLEAN: 1,
        PARAM_NOT_DATE: 2,
        PARAM_NOT_INT: 3,
        QUERY_NOT_OBJ: 8,
        QUERY_PARAM_NOT_ACCEPTED: 4,
        QUERY_PARAM_VALUE_NOT_ACCEPTED: 5,
        ENTITY_TYPE_NOT_VALID: 6,
        ENTITY_NOT_FOUND: 7,
        ENTITY_MISSING_FIELDS: 9,
        FILE_INCORRECT_FORMAT: 60,
        FILE_MISSING: 61,
        TEACHER_COURSE_MISMATCH_AA: 30,
        ROUTE_FORBIDDEN: 0,
    };

    static getErrorMessage(errno, args = {}) {
        switch (errno) {
            case ResponseError.errno.BOOKING_INVALID_STATUS:
                return `Query parameter status = ${args.status} is not accepted`;

            case ResponseError.errno.BOOKING_NOT_PRESENT:
                return `Booking with studentId = ${args.studentId} and lectureId = ${args.lectureId} does not exist`;

            case ResponseError.errno.BOOKING_NOT_UPDATABLE:
                return `The booking (lecture = ${args.lectureId} and student = ${args.studentId}) is not updatable`;

            case ResponseError.errno.COURSE_NOT_ENROLLED_AA:
                return `student (student = ${args.studentId}) is not enrolled in this course (courseId = ${args.courseId}) during this AA`;

            case ResponseError.errno.COURSE_LECTURE_MISMATCH_AA:
                return `lecture (lectureId = ${args.lectureId}) does not belong to this course (courseId = ${args.courseId}) or lecture has already been delivered`;

            case ResponseError.errno.DB_GENERIC_ERROR:
                return `DB failure: ${args.msg}`;

            case ResponseError.errno.DB_SQLITE_CONSTRAINT_FAILED:
                return `DB constraint failed: ${args.msg}`;

            case ResponseError.errno.LECTURE_GIVEN:
                return "message not implemented";

            case ResponseError.errno.LECTURE_NOT_CANCELLABLE:
                return `Lecture with lectureId = ${args.lectureId} is not cancellable`;

            case ResponseError.errno.LECTURE_NOT_SWITCHABLE:
                return `Lecture with lectureId = ${args.lectureId} is not switchable`;

            case ResponseError.errno.LECTURE_NOT_FOUND:
                return `lecture with lectureId = ${args.lectureId} not found`;

            case ResponseError.errno.LECTURE_INVALID_DELIVERY_MODE:
                return `Query parameter switchTo = '${args.delivery}' is not valid`;

            case ResponseError.errno.PARAM_NOT_DATE: {
                const keyName = Object.keys(args)[0];
                return `'${args[keyName]}' is not a valid date`;
            }

            case ResponseError.errno.PARAM_NOT_INT: {
                const keyName = Object.keys(args)[0];
                return `'${keyName}' parameter is not an integer: ${args[keyName]}`;
            }

            case ResponseError.errno.PARAM_NOT_BOOLEAN: {
                const keyName = Object.keys(args)[0];
                return `'${keyName}' parameter is not a boolean: ${args[keyName]}`;
            }

            case ResponseError.errno.QUERY_NOT_OBJ: {
                const keyName = Object.keys(args)[0];
                return `'${keyName}' parameter is not an object: ${args[keyName]}`;
            }


            case ResponseError.errno.QUERY_PARAM_NOT_ACCEPTED: {
                return `Query '${args.params.join(", ")}' not accepted`;
            }

            case ResponseError.errno.QUERY_PARAM_VALUE_NOT_ACCEPTED:
                return `Query paramters 's value must be of type ${args.type}`;

            case ResponseError.errno.ENTITY_TYPE_NOT_VALID:
                return `Entity type ${args.type} is not valid`;

            case ResponseError.errno.ENTITY_NOT_FOUND:
                return `Entity ${args.type} not found`;

            case ResponseError.errno.ENTITY_MISSING_FIELDS:
                return `Expected fields for every entity: (${args.fields.join(",")})`;

            case ResponseError.errno.FILE_INCORRECT_FORMAT:
                return `filename: ${args.filename} reason: ${args.reason}`;

            case ResponseError.errno.FILE_MISSING:
                return `File missing`;

            case ResponseError.errno.TEACHER_COURSE_MISMATCH_AA:
                return `course (courseId = ${args.courseId}) is not taught by this teacher (teacherId = ${args.teacherId})`;

            case ResponseError.errno.ROUTE_FORBIDDEN:
                return "message not implemented";

            default:
                return "No message (case default)";
        }
    }

    static getDefaultStatusCode(errno) {
        return defaultStatusCode[ResponseError.getErrnoName(errno)];
    }

    static getErrnoName(errno) {
        for(const [key, value] of Object.entries(ResponseError.errno)) {
            if (value === errno) return key;
        }

        return undefined;
    }
}

module.exports = { ResponseError };
