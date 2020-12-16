const express = require("express");
const router = express.Router();
const Officer = require("../services/SupportOfficerService");
const utils = require("../utils/writer");

router.post("/:supportId/uploads/students", manageEntitiesUpload);
router.post("/:supportId/uploads/courses", manageEntitiesUpload);
router.post("/:supportId/uploads/teachers", manageEntitiesUpload);
router.post("/:supportId/uploads/schedules", manageEntitiesUpload);
router.post("/:supportId/uploads/enrollments", manageEntitiesUpload);
module.exports.SupportOfficerRouter = router;

function manageEntitiesUpload(req, res) {
    Officer.manageEntitiesUpload(req.body, req.path)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
}
