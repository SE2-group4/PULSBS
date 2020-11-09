"use strict";

const Teacher = require("../services/TeacherService");
const utils = require("../utils/writer");

// TODO
module.exports.teacherGetCourseLectureStudents = function teacherGetCourseLectureStudents(req, res, next) {
  const teacherId = parseInt(req.params.teacherId);
  const courseId = parseInt(req.params.courseId);
  const lectureId = parseInt(req.params.lectureId);
  Teacher.teacherGetCourseLectureStudents(teacherId, courseId, lectureId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// TODO
module.exports.teacherGetCourseLectures = function teacherGetCourseLectures(req, res, next) {
  const teacherId = parseInt(req.params.teacherId);
  const courseId = parseInt(req.params.courseId);
  Teacher.teacherGetCourseLectures(teacherId, courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// TODO
module.exports.teacherGetCourses = function teacherGetCourses(req, res, next) {
  const teacherId = parseInt(req.params.teacherId);
  Teacher.teacherGetCourses(teacherId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
