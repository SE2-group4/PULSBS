/**
 * database access management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const sqlite = require('sqlite3');
const Teacher = require('./../entities/Teacher.js');
const Student = require('./../entities/Student.js');
const Lecture = require('./../entities/Lecture.js');
const EmailType = require('./../entities/EmailType.js');

let dbpath = './PULSBS.db'; // default
let db = null;

/**
 * open a new database connection
 * it closes existing connections before creating the new one
 * @param {string} dbpath
 */
exports.openConn = function(dbpath) {
    if(!(db == undefined || db == null))
        db.close();
    db = new sqlite.Database(dbpath, (err) => {
        if (err) throw err;
    });
    return;
}

/**
 * perform login
 * @param {Teacher | Student} user - email and password needed
 * @returns {Promise} promise
 */
exports.login = function(user) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * record a booking in the system
 * @param {Student} student 
 * @param {Lecture} lecture
 * @returns {Promise} promise
 */
exports.addBooking = function(student, lecture) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get the list of lectures a student can attend to
 * only future lectures are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
exports.getLecturesByStudent = function(student) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get the list of courses a student is enrolled to
 * only courses for the current academic year are considered
 * @param {Student} student - studentId needed
 * @returns {Promise} promise
 */
exports.getCoursesByStudent = function(student) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get a list of lectures related to a specific course
 * only future lectures are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
exports.getLecturesByCourse = function(course) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get a list of students booked for a specific lecture
 * @param {Lecture} lecture - lectureId needed
 * @returns {Promise} promise
 */
exports.getStudentsByLecture = function(lecture) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get a list of students enrolled in a specific course
 * only courses for the current academic year are considered
 * @param {Course} course - courseId needed
 * @returns {Promise} promise
 */
exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get a list of lectures a teacher will give
 * only lectures in the future are considered
 * @param {Teacher} teacher 
 * @returns {Promise} promise
 */
exports.getLecturesByTeacher = function(teacher) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get a list of courses a teacher is holding
 * only courses in the current academic year are considered
 * @param {Teacher} teacher 
 * @returns {Promise} promise
 */
exports.getCoursesByTeacher = function(teacher) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * crea a new booking email for a student
 * @param {Student} student 
 * @param {Lecture} lecture 
 * @returns {Promise} promise
 */
exports._createStudentBookingEmail = function(student, lecture) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * create a new email to inform a teacher about students that will attend his/her lecture
 * @param {Lecture} lecture 
 * @returns {Promise} promise
 */
exports._createTeacherBookingsEmail = function(lecture) {
    return new Promise((resolve, reject) => {

    })
}

/**
 * get the current academic year
 * based on the server time
 * @returns {Number} year
 */
exports._getCurrentAcademicYear = function() {
    return new Promise((resolve, reject) => {

    })
}

/**
 * create a log in the database of an email
 * @param {Teacher | Student} user - teacherId or studentId neeeded
 * @param {Teacher | Student} user - teacherId or studentId neeeded
 * @param {EmailType} emailType 
 */
exports.addEmail = function(user, user, emailType) {
    return new Promise((resolve, reject) => {

    })
}