/**
 * Student dao accesses
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const Student = require("../entities/Student.js");
const Course = require("../entities/Course.js");
const Lecture = require("../entities/Lecture.js");
const EmailType = require('./../entities/EmailType.js');
const emailService = require('./EmailService.js');
const utils = require('../utils/utils.js');

const dao = require("../db/Dao.js");

/**
 * record a new booking
 * @param {Number} studentId
 * @param {Number} courseId
 * @param {Number} lectureId
 * @returns {Promise} promise
 */
exports.studentBookLecture = async function(studentId, courseId, lectureId) {
    const student = new Student(studentId);
    const course = new Course(courseId);
    const lecture = new Lecture(lectureId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getLecturesByCourse(course)
            .then((currLectures) => {
                const actualLectures = currLectures.filter(l => l.lectureId === lecture.lectureId);
                if(actualLectures.length === 0) {
                    reject({ error : 'The lecture is not related to this course' });
                    return;
                }

                const actualLecture = actualLectures[0];
                if(actualLecture.bookingDeadline.getTime() < (new Date()).getTime()){
                    reject({ error : 'The booking time is expired' });
                    return;
                }

                dao.getCoursesByStudent(student)
                    .then((currCourses) => {
                        const actualCourses = currCourses.filter(c => c.courseId === course.courseId);
                        if(actualCourses.length === 0) {
                            reject({ error : 'The student is not enrolled in this course' });
                            return;
                        }
                        const actualCourse = actualCourses[0];

                        dao.addBooking(student, lecture)
                            .then(() => {
                                dao.getUserById(student)
                                    .then((currStudent) => {
                                        emailService.sendConfirmationBookingEmail(
                                                currStudent.email,
                                                actualCourse.description,
                                                utils.formatDate(actualLecture.date))
                                            .then(resolve);
                                    })
                            })
                            .catch(reject);
                    });
            });
        
    });
};

/**
 * get the list of lectures given a student and a course
 * @param {Number} studentId
 * @param {Number} courseId
 * @returns {Promise} promise
 */
exports.studentGetCourseLectures = function(studentId, courseId) {
    const student = new Student(studentId);
    const course = new Course(courseId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getCoursesByStudent(student)
            .then((currCourses) => {
                if(currCourses.filter(c => c.courseId === course.courseId).length === 0) {
                    reject({ error : 'The student is not enrolled in this course' });
                    return;
                }
                
                dao.getLecturesByCourse(course)
                    .then(resolve)
                    .catch(reject);
            });
    });
};

/**
 * get a list of courses given a student
 * @param {Number} studentId
 * @returns {Promise} promise
 */
exports.studentGetCourses = function(studentId) {
    const student = new Student(studentId);

    return dao.getCoursesByStudent(student);
};
