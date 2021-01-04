"use strict";

const Teacher = require("../services/TeacherService");
const utils = require("../utils/writer");
const express = require("express");
const router = express.Router();

router.put("/:teacherId/courses/:courseId/lectures/:lectureId/students/:studentId", teacherUpdateCourseLectureStudentStatus);
router.get("/:teacherId/courses/:courseId/lectures/:lectureId/students", teacherGetCourseLectureStudents);
router.get("/:teacherId/courses/:courseId/lectures/:lectureId", teacherGetCourseLecture);
router.delete("/:teacherId/courses/:courseId/lectures/:lectureId", teacherDeleteCourseLecture);
router.put("/:teacherId/courses/:courseId/lectures/:lectureId", teacherUpdateCourseLecture);
router.get("/:teacherId/courses/:courseId/lectures", teacherGetCourseLectures);
router.get("/:teacherId/courses", teacherGetCourses);
module.exports.TeacherRouter = router;

function teacherGetCourseLectureStudents(req, res) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    Teacher.teacherGetCourseLectureStudents(teacherId, courseId, lectureId, req.query.status)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.teacherGetCourseLectureStudents = teacherGetCourseLectureStudents;

function teacherGetCourseLectures(req, res) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const queryString = req.query; // is an empty object when no query is passed

    Teacher.teacherGetCourseLectures(teacherId, courseId, queryString)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.teacherGetCourseLectures = teacherGetCourseLectures;

function teacherGetCourses(req, res) {
    const teacherId = req.params.teacherId;

    Teacher.teacherGetCourses(teacherId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.teacherGetCourses = teacherGetCourses;

function teacherGetCourseLecture(req, res) {
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
}
module.exports.teacherGetCourseLecture = teacherGetCourseLecture;

function teacherDeleteCourseLecture(req, res) {
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
}
module.exports.teacherDeleteCourseLecture = teacherDeleteCourseLecture;

function teacherUpdateCourseLecture(req, res) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    Teacher.teacherUpdateCourseLectureDeliveryMode(teacherId, courseId, lectureId, req.query.switchTo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.teacherUpdateCourseLecture = teacherUpdateCourseLecture;

function teacherUpdateCourseLectureStudentStatus(req, res) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;
    const studentId = req.params.studentId;

    Teacher.teacherUpdateCourseLectureStudentStatus(teacherId, courseId, lectureId, studentId, req.query.status)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.teacherUpdateCourseLecture = teacherUpdateCourseLecture;

function checkForExpiredLectures() {
    return Teacher.checkForExpiredLectures();
}
module.exports.checkForExpiredLectures = checkForExpiredLectures;

function nextCheck() {
    return Teacher.nextCheck();
};
module.exports.nextCheck = nextCheck;
