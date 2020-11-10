"use strict";

const Student = require("../services/StudentService");
const utils = require("../utils/writer");

// TODO
module.exports.studentBookLecture = function studentBookLecture(req, res, next) {
  const studentId = req.params.studentId;
  const courseId = req.params.courseId;
  const lectureId = req.params.lectureId;

  Student.studentBookLecture(studentId, courseId, lectureId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// TODO
module.exports.studentGetCourseLectures = function studentGetCourseLectures(req, res, next) {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;

  Student.studentGetCourseLectures(studentId, courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// TODO
module.exports.studentGetCourses = function studentGetCourses(req, res, next) {
  const studentId = req.params.studentId;

  Student.studentGetCourses(studentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
