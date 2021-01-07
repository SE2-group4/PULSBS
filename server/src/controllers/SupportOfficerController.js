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
router.delete("/:supportId/courses/:courseId/lectures/:lectureId", supportOfficerDeleteCourseLecture);
router.get("/:supportId/schedules", supportOfficerGetSchedules);
router.put("/:supportId/schedules/:scheduleId", supportOfficerUpdateSchedule);
router.get("/:supportId/rooms", supportOfficerGetRooms);
module.exports.SupportOfficerRouter = router;

/**
 * endpoint for uploading new entities to the system
 * @param {Object} req
 * @param {Object} res
 */
function manageEntitiesUpload(req, res) {
    //const schedules = fs.readFileSync("./input/schedules.json", "utf-8");

    Officer.manageEntitiesUpload(req.body, req.path)
        //Officer.manageEntitiesUpload(JSON.parse(schedules), "./schedules")
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * get all courses
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerGetCourses(req, res) {
    Officer.getCourses(req.params.supportId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * get all lectures of a given course
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficergetCourseLectures(req, res) {
    Officer.getCourseLectures(req.params.supportId, req.params.courseId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * retrieve the lecture with a given id 
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerUpdateCourseLecture(req, res) {
    Officer.updateCourseLecture(req.params.supportId, req.params.courseId, req.params.lectureId, req.query.switchTo)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * delete a lecture
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerDeleteCourseLecture(req, res) {
    Officer.deleteCourseLecture(req.params, req.params.courseId, req.params.lectureId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * get all rooms
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerGetRooms(req, res) {
    Officer.supportOfficerGetRooms(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}


/**
 * get the list of all schedules
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerGetSchedules(req, res) {
    Officer.supportOfficerGetSchedules(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}

/**
 * update an existing schedule
 * @param {Object} req
 * @param {Object} res
 */
function supportOfficerUpdateSchedule(req, res) {
    Officer.supportOfficerUpdateSchedule(req.params, req.query)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
