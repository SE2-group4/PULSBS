const utils = require("../utils/writer");
const express = require("express");
const Manager = require("../services/ManagerService");
const router = express.Router();

router.get("/:managerId/courses/:courseId/lectures/:lectureId", managerGetCourseLecture);
router.get("/:managerId/courses/:courseId/lectures", managerGetCourseLectures);
router.get("/:managerId/courses", managerGetCourses);

router.get("/:managerId/students", managerGetStudent);
router.get("/:managerId/tracingReport/:serialNumber", managerGetReport);

module.exports.ManagerRouter = router;

function managerGetCourseLecture(req, res) {
    Manager.managerGetCourseLecture(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.managerGetCourseLecture = managerGetCourseLecture;

function managerGetCourseLectures(req, res) {
    Manager.managerGetCourseLectures(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.managerGetCourseLectures = managerGetCourseLectures;

function managerGetCourses(req, res) {
    Manager.managerGetCourses(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.managerGetCourses = managerGetCourses;

function managerGetStudent(req, res) {
    Manager.managerGetStudent(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, response.statusCode);
        });
}
module.exports.managerGetStudent = managerGetStudent;

function managerGetReport(req, res) {
    Manager.managerGetReport(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
module.exports.managerGetReport = managerGetReport;
