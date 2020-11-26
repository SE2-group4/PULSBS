"use strict";

const Teacher = require("../services/TeacherService");
const utils = require("../utils/writer");

module.exports.teacherGetCourseLectureStudents = function teacherGetCourseLectureStudents(req, res, next) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    Teacher.teacherGetCourseLectureStudents(teacherId, courseId, lectureId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.teacherGetCourseLectures = function teacherGetCourseLectures(req, res, next) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const queryString = req.query;

    Teacher.teacherGetCourseLectures(teacherId, courseId, queryString)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.teacherGetCourses = function teacherGetCourses(req, res, next) {
    const teacherId = req.params.teacherId;

    Teacher.teacherGetCourses(teacherId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.teacherGetCourseLecture = function teacherGetCourseLecture(req, res, next) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    Teacher.teacherGetCourseLecture(teacherId, courseId, lectureId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.teacherDeleteCourseLecture = function teacherDeleteCourseLecture(req, res, next) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    Teacher.teacherDeleteCourseLecture(teacherId, courseId, lectureId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.teacherPutCourseLecture = function teacherPutCourseLecture(req, res, next) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;
    let switchTo;

    if(req.query.switchTo) {
      switchTo = req.query.switchTo; 
    }

    Teacher.teacherUpdateCourseLectureDeliveryMode(teacherId, courseId, lectureId, switchTo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.checkForExpiredLectures = function checkForExpiredLectures() {
    return Teacher.checkForExpiredLectures();
};

module.exports.nextCheck = function checkForExpiredLectures() {
    return Teacher.nextCheck();
};
