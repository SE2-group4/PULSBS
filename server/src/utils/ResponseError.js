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
      error: this.getErrorMessage(errno, msgArgs),
      statusCode: statusCode,
    };
    this.statusCode = statusCode;
    console.log(this.payload, this.statusCode);
  }

  static get COURSE_NOT_ENROLLED_AA() {
    return 10;
  }
  static get COURSE_LECTURE_MISMATCH_AA() {
    return 11;
  }
  static get LECTURE_GIVEN() {
    return 20;
  }
  static get LECTURE_NOT_EXIST() {
    return 21;
  }
  static get PARAM_NOT_INT() {
    return 1;
  }
  static get TEACHER_COURSE_MISMATCH_AA() {
    return 30;
  }
  static get ROUTE_FORBIDDEN() {
    return 0;
  }

  getErrorMessage(errno, args) {
    console.log("i am here");
    console.log(errno, args);
    switch (errno) {
      case ResponseError.COURSE_NOT_ENROLLED_AA:
        return `student (student = ${args.studentId}) is not enrolled in this course (courseId = ${args.courseId}) during this AA`;
      case ResponseError.COURSE_LECTURE_MISMATCH_AA:
        return `lecture (lectureId = ${args.lectureId}) does not belong to this course (courseId = ${args.courseId}).\
          Or the lecture has already been given`;
      case ResponseError.LECTURE_GIVEN:
        return "message not implemented";
      case ResponseError.LECTURE_NOT_EXIST:
        return "message not implemented";
      case ResponseError.PARAM_NOT_INT:
        const keyName = Object.keys(args)[0];
        return `'${keyName}' parameter is not an integer: ${args[keyName]}`;
      case ResponseError.TEACHER_COURSE_MISMATCH_AA:
        return `course (courseId = ${args.courseId}) is not taught by this teacher (teacherId = ${args.teacherId})`;
      case ResponseError.ROUTE_FORBIDDEN:
        return "message not implemented";
      default:
        console.log("default");
    }
    console.log("out");
  }
}

module.exports.ResponseError = ResponseError;
