/**
 * Student dao accesses
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const Student = require("../entities/Student.js");
const Course = require("../entities/Course.js");
const Lecture = require("../entities/Lecture.js");

const dao = require("../db/Dao.js");

/**
 * record a new booking
 * @param {Object} body
 * @returns {Promise} promise
 */
exports.studentBookLecture = async function(body) {
    const student = new Student(body.studentId);
    const course = new Lecture(body.courseId);
    const lecture = new Lecture(body.lectureId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getLecturesByCourse(course)
            .then((currLectures) => {
                if(!currLectures.filter(l => l.lectureId === lecture.lectureId)) {
                    reject({ error : 'The lecture is not related to this course' });
                    return;
                }

                dao.getCoursesByStudent(student)
                    .then((currStudents) => {
                        if(!currCourses.filter(c => c.courseId === course.courseId)) {
                            reject({ error : 'The student is not enrolled in this course' });
                            return;
                        }
                
                        dao.addBooking(student, Lecture)
                            .then(resolve)
                            .catch(reject);
                    });
            });
        
    });
};

/**
 * get the list of lectures given a student and a course
 * @param {Object} body
 * @returns {Promise} promise
 */
exports.studentGetCourseLectures = function(body) {
    const student = new Student(body.studentId);
    const course = new Lecture(body.courseId);
    const lecture = new Lecture(body.lectureId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getCoursesByStudent(student)
            .then((currCourses) => {
                if(!currCourses.filter(c => c.courseId === course.courseId)) {
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
 * @param {Object} body
 * @returns {Promise} promise
 */
exports.studentGetCourses = function(body) {
    const student = new Student(body.studentId);

    return dao.getCoursesByStudent(student);
};
