"use strict";

const Teacher = require("../services/TeacherService");
const utils = require("../utils/writer");
const express = require("express");
const router = express.Router();

router.get("/:teacherId/courses/:courseId/lectures/:lectureId/students", teacherGetCourseLectureStudents);
router.get("/:teacherId/courses/:courseId/lectures/:lectureId", teacherGetCourseLecture);
router.delete("/:teacherId/courses/:courseId/lectures/:lectureId", teacherDeleteCourseLecture);
router.put("/:teacherId/courses/:courseId/lectures/:lectureId", teacherPutCourseLecture);
router.get("/:teacherId/courses/:courseId/lectures", teacherGetCourseLectures);
router.get("/:teacherId/courses", teacherGetCourses);
module.exports.TeacherRouter = router;

function teacherGetCourseLectureStudents(req, res) {
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
};
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
};
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
};
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
};
module.exports.teacherDeleteCourseLecture = teacherDeleteCourseLecture;

function teacherPutCourseLecture(req, res) {
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;
    let switchTo = undefined;

    if (req.query.switchTo) {
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
module.exports.teacherPutCourseLecture = teacherPutCourseLecture;

function checkForExpiredLectures() {
    return Teacher.checkForExpiredLectures();
};
module.exports.checkForExpiredLectures = checkForExpiredLectures;

function nextCheck() {
    return Teacher.nextCheck();
};
module.exports.nextCheck = nextCheck;
