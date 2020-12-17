/**
 * Student requests and responses management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const controller = require('express').Router({ mergeParams: true });
const service = require("../services/StudentService.js");
const { check, validationResult } = require('express-validator');
const utils = require('../utils/utils.js');
const moment = require('moment');

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
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    service.studentBookLecture(studentId, courseId, lectureId)
        .then(() => res.status(204).end())
        .catch((err) => res.status(err.statusCode).json(err).end());
});

/**
 * delete a booking
 */
controller.delete('/:studentId/courses/:courseId/lectures/:lectureId', [
    check('studentId').isInt(),
    check('courseId').isInt(),
    check('lectureId').isInt()
], (req, res) => {

    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    const lectureId = Number(req.params.lectureId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    service.studentUnbookLecture(studentId, courseId, lectureId)
        .then((retVal) => { console.log(retVal); console.log({ availableSeats: retVal }); res.status(200).json({ availableSeats: retVal }).end() })
        .catch((err) => res.status(err.statusCode).json(err).end());
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
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    const periodOfTime = {};
    if (req.query.from)
        periodOfTime.from = moment(req.query.from);
    if (req.query.to)
        periodOfTime.from = moment(req.query.to);

    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    service.studentGetCourseLectures(studentId, courseId, periodOfTime)
        .then((lectures) => res.status(200).json(lectures).end())
        .catch((err) => res.status(err.statusCode).json(err).end());

});

/**
 * get a list of courses given a student
 */
controller.get('/:studentId/courses', [
    check('studentId').isInt()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    const studentId = Number(req.params.studentId);
    service.studentGetCourses(studentId)
        .then((courses) => res.status(200).json(courses).end())
        .catch((err) => res.status(err.statusCode).json(err).end());
});

/**
 * get the student list of bookings
 */
controller.get('/:studentId/bookings', [
    check('studentId').isInt()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    const periodOfTime = {};
    const fromDate = moment(req.query.from);
    if (fromDate.isValid())
        periodOfTime.from = fromDate;
    const toDate = moment(req.query.from);
    if (toDate.isValid())
        periodOfTime.to = toDate;

    const studentId = Number(req.params.studentId);
    service.studentGetBookings(studentId)
        .then((lectures) => res.status(200).json(lectures).end())
        .catch((err) => res.status(err.statusCode).json(err).end());
});

/**
 * insert a student into the waiting list
 */
controller.get('/:studentId/courses/:courseId/lectures/:lectureId/queue', [
    check('studentId').isInt(),
    check('courseId').isInt(),
    check('lectureId').isInt()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(utils.toStandard(errors, 400)).end();
        return;
    }

    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    const lectureId = Number(req.params.lectureId);

    service.studentPushQueue(studentId, courseId, lectureId)
        .then((retVal) => res.status(200).json(lectures).end())
        .catch((err) => res.status(err.statusCode).json(err).end());
});

module.exports = controller;
