"use strict";
const express = require("express");
const router = express.Router();

router.get("/:managerId/courses/:courseId/lectures/:lectureId", managerGetCourseLecture);
router.get("/:managerId/courses/:courseId/lectures", managerGetCourseLectures);
router.get("/:managerId/courses/:courseId", managerGetCourse);
router.get("/:managerId/courses", managerGetCourses);
module.exports.ManagerRouter = router;

function managerGetCourseLecture(req, res) {
};
module.exports.managerGetCourseLecture = managerGetCourseLecture;

function managerGetCourseLectures(req, res) {
};
module.exports.managerGetCourseLectures = managerGetCourseLectures;

function managerGetCourse(req, res) {
};
module.exports.managerGetCourse = managerGetCourse;

function managerGetCourses(req, res) {
};
module.exports.managerGetCourses = managerGetCourses;


