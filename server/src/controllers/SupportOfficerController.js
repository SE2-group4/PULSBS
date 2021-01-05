const express = require("express");
const router = express.Router();
const Officer = require("../services/SupportOfficerService");
const utils = require("../utils/writer");
const fs = require("fs");

router.post("/:supportId/uploads/students", manageEntitiesUpload);
router.post("/:supportId/uploads/courses", manageEntitiesUpload);
router.post("/:supportId/uploads/teachers", manageEntitiesUpload);
router.post("/:supportId/uploads/schedules", manageEntitiesUpload);
router.post("/:supportId/uploads/enrollments", manageEntitiesUpload);
router.get("/:supportId/courses", supportOfficerGetCourses);
router.get("/:supportId/courses/:courseId/lectures", supportOfficergetCourseLectures);
router.put("/:supportId/courses/:courseId/lectures/:lectureId", supportOfficerUpdateCourseLecture);
module.exports.SupportOfficerRouter = router;

function manageEntitiesUpload(req, res) {

    const schedules = fs.readFileSync("./input/schedules.json", "utf-8");

    //Officer.manageEntitiesUpload(req.body, req.path)
    Officer.manageEntitiesUpload(JSON.parse(schedules), "./schedules")
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

function supportOfficerGetCourses(req, res) {
    Officer.getCourses(req.params.supportId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

function supportOfficergetCourseLectures(req, res) {
    Officer.getCourseLectures(req.params.supportId, req.params.courseId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

function supportOfficerUpdateCourseLecture(req, res) {
    Officer.updateCourseLecture(req.params.supportId, req.params.courseId, req.params.lectureId, req.query.switchTo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
