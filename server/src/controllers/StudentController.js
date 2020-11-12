/**
 * Student requests and responses management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const controller = require('express').Router();
const service = require("../services/StudentService.js");
const { check, validationResult } = require('express-validator');

/**
 * book a lecture
 */
controller.post('/:studentId/courses/:courseId/lectures/:lectureId', [
        check('studentId').isInt(),
        check('courseId').isInt(),
        check('lectureId').isInt()
    ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).end();
        return;
    }
    
    service.studentBookLecture(req.body)
        .then(() => {
            res.status(200).end();
        })
        .catch((err) => {
            res.status(400).json(err).end();
        });
});

/**
 * get the list of lectures given a student and a course
 */
controller.get('/:studentId/courses/:courseId/lectures', [
        check('studentId').isInt(),
        check('courseId').isInt()
    ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).end();
        return;
    }

    service.studentGetCourseLectures(req.body)
        .then((lectures) => {
            res.json(lectures).status(200).end();
        })
        .catch((err) => {
            res.json(err).status(401).end();
        });

});

/**
 * get a list of courses given a student
 */
controller.get(':studentId/courses', [
        check('studentId').isInt()
    ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).end();
        return;
    }

    service.studentGetCourses(req.body)
        .then((courses) => {
            res.json(courses).status(200).end();
        })
        .catch((err) => {
            res.json(err).status(401).end();
        });
});

module.exports = controller;
