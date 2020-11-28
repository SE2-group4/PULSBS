"use strict";

/**
 * wrapper for an error message
 * @param {String} source
 * @param {Integer} errno
 * @param {Object} message error arguments. See getErrorMessage
 * @param {Number} statusCode
 */
class ResponseError {
    constructor(source, errno, msgArgs, statusCode = 500) {
        this.payload = {
            source: source,
            errno: errno,
            message: this.getErrorMessage(errno, msgArgs),
            statusCode: statusCode,
        };
        this.statusCode = statusCode;
    }

    static get COURSE_NOT_ENROLLED_AA() {
        return 10;
    }
    static get COURSE_LECTURE_MISMATCH_AA() {
        return 11;
    }
    static get DB_GENERIC_ERROR() {
        return 40;
    }
    static get LECTURE_GIVEN() {
        return 20;
    }
    static get LECTURE_NOT_FOUND() {
        return 21;
    }
    static get LECTURE_INVALID_DELIVERY_MODE() {
        return 22;
    }
    static get LECTURE_NOT_CANCELLABLE() {
        return 23;
    }
    static get PARAM_NOT_INT() {
        return 1;
    }
    static get PARAM_NOT_DATE() {
        return 2;
    }
    static get QUERY_PARAM_NOT_ACCEPTED() {
        return 3;
    }
    static get TEACHER_COURSE_MISMATCH_AA() {
        return 30;
    }
    static get ROUTE_FORBIDDEN() {
        return 0;
    }

    getErrorMessage(errno, args) {
        switch (errno) {
            case ResponseError.COURSE_NOT_ENROLLED_AA:
                return `student (student = ${args.studentId}) is not enrolled in this course (courseId = ${args.courseId}) during this AA`;

            case ResponseError.COURSE_LECTURE_MISMATCH_AA:
                return `lecture (lectureId = ${args.lectureId}) does not belong to this course (courseId = ${args.courseId}) or lecture has already been taught`;

            case ResponseError.DB_GENERIC_ERROR:
                return args;

            case ResponseError.LECTURE_GIVEN:
                return "message not implemented";

            case ResponseError.LECTURE_NOT_CANCELLABLE:
                return `Lecture with lectureId = ${args.lectureId} is not cancellable`;

            case ResponseError.LECTURE_NOT_FOUND:
                return `lecture with lectureId = ${args.lectureId} not found`;

            case ResponseError.LECTURE_INVALID_DELIVERY_MODE:
                return `Delivery mode ${args.delivery} is not a valid input`;

            case ResponseError.PARAM_NOT_DATE: {
                const keyName = Object.keys(args)[0];
                return `'${args[keyName]}' is not a valid date`;
            }

            case ResponseError.PARAM_NOT_INT: {
                const keyName = Object.keys(args)[0];
                return `'${keyName}' parameter is not an integer: ${args[keyName]}`;
            }

            case ResponseError.QUERY_PARAM_NOT_ACCEPTED:
                return `Query parameter '${args.param}' is not accepted`;

            case ResponseError.TEACHER_COURSE_MISMATCH_AA:
                return `course (courseId = ${args.courseId}) is not taught by this teacher (teacherId = ${args.teacherId})`;

            case ResponseError.ROUTE_FORBIDDEN:
                return "message not implemented";

            default:
                return "No message (case default)";
        }
    }
}

module.exports.ResponseError = ResponseError;
