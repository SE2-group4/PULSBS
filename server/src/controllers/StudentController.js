/**
 * Student requests and responses management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const controller = require('express').Router({ mergeParams : true });
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

    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    const lectureId = Number(req.params.lectureId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors.errors).end();
        return;
    }
    
    service.studentBookLecture(studentId, courseId, lectureId)
        .then(() => res.status(200).json({msg: 'Lecture booked'}).end())
        .catch((err) => res.status(400).json(err).end());
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
        res.status(400).json(errors.errors).end();
        return;
    }

    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    service.studentGetCourseLectures(studentId, courseId)
        .then((lectures) => {
            res.status(200).json(lectures).end();
        })
        .catch((err) => {
            res.status(400).json(err).end();
        });

});

/**
 * get a list of courses given a student
 */
controller.get('/:studentId/courses', [
        check('studentId').isInt()
    ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors.errors).end();
        return;
    }

    const studentId = Number(req.params.studentId);
    service.studentGetCourses(studentId)
        .then((courses) => {
            res.status(200).json(courses).end();
        })
        .catch((err) => {
            res.status(500).json(err).end();
        });
});

module.exports = controller;
