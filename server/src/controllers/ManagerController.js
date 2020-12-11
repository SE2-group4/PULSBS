const utils = require("../utils/writer");
const express = require("express");
const Manager = require("../services/ManagerService");
const router = express.Router();

router.get("/:managerId/courses/:courseId/lectures/:lectureId", managerGetCourseLecture);
router.get("/:managerId/courses/:courseId/lectures", managerGetCourseLectures);
router.get("/:managerId/courses/:courseId", managerGetCourse);
router.get("/:managerId/courses", managerGetCourses);
module.exports.ManagerRouter = router;


function managerGetCourseLecture(req, res) {
    Manager.managerGetCourseLecture(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourseLecture = managerGetCourseLecture;

// TODO
function managerGetCourseLectures(req, res) {
    Manager.managerGetCourseLectures(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourseLectures = managerGetCourseLectures;

function managerGetCourse(req, res) {
    Manager.managerGetCourse(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourse = managerGetCourse;

function managerGetCourses(req, res) {
    Manager.managerGetCourses(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourses = managerGetCourses;
