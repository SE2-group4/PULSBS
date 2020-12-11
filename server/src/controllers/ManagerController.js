const utils = require("../utils/writer");
const express = require("express");
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
    res.send("not implemented");
    return;
    const { managerId, courseId, lectureId } = req.params;
    console.table(managerId, courseId, lectureId);

    Manager.managerGetCourseLecture()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourseLectures = managerGetCourseLectures;

function managerGetCourse(req, res) {
    res.send("not implemented");
    return;
    const managerId = req.params.managerId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;
    console.table(req.params);

    Manager.managerGetCourseLecture()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourse = managerGetCourse;

function managerGetCourses(req, res) {
    res.send("not implemented");
    return;
    const managerId = req.params.managerId;
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;
    console.table(req.params);

    Manager.managerGetCourseLecture()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
module.exports.managerGetCourses = managerGetCourses;
