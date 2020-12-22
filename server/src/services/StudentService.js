/**
 * Student dao accesses
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const Student = require("../entities/Student.js");
const Course = require("../entities/Course.js");
const Lecture = require("../entities/Lecture.js");
// const EmailType = require('./../entities/EmailType.js');
const Email = require('./../entities/Email.js');
const emailService = require('./EmailService.js');
const utils = require('../utils/utils.js');
const { StandardErr } = require('./../utils/utils.js');

const dao = require("../db/Dao.js");

/**
 * record a new booking
 * @param {Number} studentId
 * @param {Number} courseId
 * @param {Number} lectureId
 * @returns {Promise} promise
 */
exports.studentBookLecture = function (studentId, courseId, lectureId) {
    const student = new Student(studentId);
    const course = new Course(courseId);
    const lecture = new Lecture(lectureId);

    return new Promise((resolve, reject) => {
        // logical checks

        Promise.all([
            dao.getLecturesByCourse(course),
            dao.getCoursesByStudent(student)
        ])
            .then((initValues) => {
                const currLectures = initValues[0];
                const currCourses = initValues[1];

                const actualLectures = currLectures.filter(l => l.lectureId === lecture.lectureId);
                if (actualLectures.length === 0) {
                    reject(StandardErr.new('Student service', StandardErr.errno.PARAMS_MISMATCH, 'The lecture is not related to this course', 404));
                    return;
                }

                const actualLecture = actualLectures[0];
                if (actualLecture.bookingDeadline.getTime() < (new Date()).getTime()) {
                    reject(StandardErr.new('Student service', StandardErr.errno.WRONG_VALUE, 'The booking time is expired', 404));
                    return;
                }

                if(actualLecture.delivery != Lecture.DeliveryType.PRESENCE) {
                    reject(StandardErr.new('Student service', StandardErr.errno.NOT_ALLOWED, 'You do not have to book a lecture delivered in remote', 404));
                    return;
                }

                const actualCourses = currCourses.filter(c => c.courseId === course.courseId);
                if (actualCourses.length === 0) {
                    reject(StandardErr.new('Student service', StandardErr.errno.PARAMS_MISMATCH, 'The student is not enrolled in this course', 404));
                    return;
                }
                const actualCourse = actualCourses[0];

                dao.lectureHasFreeSeats(lecture)
                    .then((nSeats) => {
                        if (nSeats <= 0) {
                            reject(StandardErr.new('studentService', StandardErr.errno.NOT_AVAILABLE, 'No more free seats for this booking', 409));
                            return;
                        }

                        dao.addBooking(student, lecture)
                            .then((retVal) => {
                                Promise.all([dao.getClassByLecture(actualLecture), dao.getUserById(student)])
                                    .then((values) => {
                                        const actualClass = values[0];
                                        const actualStudent = values[1];

                                        const defaultEmail = emailService.getDefaultEmail(Email.EmailType.STUDENT_NEW_BOOKING, [
                                            actualCourse.description,
                                            utils.formatDate(actualLecture.date),
                                            actualClass.description
                                        ]);
                                        emailService.sendCustomMail(
                                                actualStudent.email,
                                                defaultEmail.subject,
                                                defaultEmail.message)
                                            .then(() => {
                                                resolve(retVal);
                                                return;
                                            })
                                            .catch((err) => {
                                                reject(new StandardErr('StudentService', StandardErr.errno.FAILURE, 'Email service not working', 500));
                                                return;
                                            });
                                    })
                                    .catch(reject)
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

/**
 * remove a booking
 * @param {Number} studentId 
 * @param {Number} courseId 
 * @param {Number} lectureId 
 * @returns {Promise} promise
 */
exports.studentUnbookLecture = function (studentId, courseId, lectureId) {
    const student = new Student(studentId);
    // const course = new Course(courseId);
    const lecture = new Lecture(lectureId);

    return new Promise((resolve, reject) => {
        dao.deleteBooking(student, lecture)
            .then((modifiedBookings) => {
                if (modifiedBookings != 1) {
                    reject(new StandardErr('StudentService', StandardErr.errno.NOT_EXISTS, 'This booking does not exists', 404));
                    return;
                }
                dao.studentPopQueue(lecture) // try to pick a student from the queue
                    .then((waitingStudent) => {
                        Promise.all([dao.getCourseByLecture(lecture), dao.getLectureById(lecture), dao.getClassByLecture(lecture)])
                            .then((values) => {
                                const actualCourse = values[0];
                                const actualLecture = values[1];
                                const actualClass = values[2];
                                
                                const defaultEmail = emailService.getDefaultEmail(Email.EmailType.STUDENT_POP_QUEUE, [
                                    actualCourse.description,
                                    utils.formatDate(actualLecture.date),
                                    actualClass.description
                                ]);
                                emailService.sendCustomMail( // inform the student he/she has been picked from the queue
                                        waitingStudent.email,
                                        defaultEmail.subject,
                                        defaultEmail.message)   
                                    .then(() => {
                                        this.studentBookLecture(waitingStudent.studentId, courseId, lectureId) // record the new booking
                                        .then((retVal) => {
                                            dao.lectureHasFreeSeats(lecture)
                                                .then(resolve)
                                                .catch(reject);
                                        })
                                        .catch(reject);
                                    })
                                    .catch((err) => {
                                        reject(new StandardErr('StudentService', StandardErr.errno.FAILURE, 'Email service not working', 500));
                                        return;
                                    });
                            })
                            .catch(reject);
                    })
                    .catch((err) => {
                        dao.lectureHasFreeSeats(lecture)
                            .then(resolve)
                            .catch(reject);
                    }); // if no students are waiting, not an error
            })
            .catch(reject);
    });
}

/**
 * get the list of lectures given a student and a course
 * @param {Number} studentId
 * @param {Number} courseId
 * @param {Object} periodOfTime
 * @returns {Promise} promise
 */
exports.studentGetCourseLectures = function (studentId, courseId, periodOfTime = {}) {
    const student = new Student(studentId);
    const course = new Course(courseId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getCoursesByStudent(student)
            .then((currCourses) => {
                if (currCourses.filter(c => c.courseId === course.courseId).length === 0) {
                    reject(StandardErr.new('Student service', StandardErr.errno.PARAMS_MISMATCH, 'The student is not enrolled in this course', 404));
                    return;
                }

                dao.getLecturesByCourseAndPeriodOfTime(course, periodOfTime)
                    .then((lectures) => {
                        const classPromises = [];
                        const bookingsPromises = [];
                        for (const currLecture of lectures) {
                            classPromises.push(dao.getClassByLecture(currLecture));
                            bookingsPromises.push(dao.getNumBookingsOfLecture(currLecture));
                        }

                        Promise.all(classPromises)
                            .then((classes) => {
                                Promise.all(bookingsPromises)
                                    .then((bookings) => {
                                        const retLectures = [];
                                        for (let i = 0; i < lectures.length; i++) {
                                            retLectures.push({
                                                lecture: lectures[i],
                                                class_: classes[i],
                                                nBookings: bookings[i]
                                            });
                                        }
                                        resolve(retLectures);
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
    });
};

/**
 * get a list of courses given a student
 * @param {Number} studentId
 * @returns {Promise} promise
 */
exports.studentGetCourses = function (studentId) {
    const student = new Student(studentId);

    return dao.getCoursesByStudent(student);
};

/**
 * get the list of lectures booked and waited for
 * @param {Number} studentId 
 * @param {Object} periodOfTime
 * @returns {Promise} promise
 */
exports.studentGetBookings = function (studentId, periodOfTime) {
    const student = new Student(studentId);

    return new Promise((resolve, reject) => {
        Promise.all([
            dao.getBookingsByStudentAndPeriodOfTime(student, periodOfTime),
            dao.getWaitingsByStudentAndPeriodOfTime(student, periodOfTime)
        ])
            .then((values) => {
                const lectures = {
                    booked: values[0],
                    waited: values[1]
                }
                resolve(lectures);
            })
            .catch(reject);
    });

};

/**
 * insert a student in waiting list
 * @param {Number} studentId 
 * @param {Number} courseId
 * @param {Number} lectureId 
 */
exports.studentPushQueue = function (studentId, courseId, lectureId) {
    const student = new Student(studentId);
    const course = new Course(courseId);
    const lecture = new Lecture(lectureId);

    return new Promise((resolve, reject) => {
        // logical checks
        dao.getLecturesByCourse(course)
            .then((currLectures) => {
                const actualLectures = currLectures.filter(l => l.lectureId === lecture.lectureId);
                if (actualLectures.length === 0) {
                    reject(StandardErr.new('Student service', StandardErr.errno.PARAMS_MISMATCH, 'The lecture is not related to this course', 404));
                    return;
                }

                const actualLecture = actualLectures[0];
                if (actualLecture.bookingDeadline.getTime() < (new Date()).getTime()) {
                    reject(StandardErr.new('Student service', StandardErr.errno.WRONG_VALUE, 'The booking time is expired', 404));
                    return;
                }

                dao.getCoursesByStudent(student)
                    .then((currCourses) => {
                        const actualCourses = currCourses.filter(c => c.courseId === course.courseId);
                        if (actualCourses.length === 0) {
                            reject(StandardErr.new('Student service', StandardErr.errno.PARAMS_MISMATCH, 'The student is not enrolled in this course', 404));
                            return;
                        }
                        const actualCourse = actualCourses[0];

                        dao.studentPushQueue(student, lecture)
                            .then((retVal) => {
                                dao.getUserById(student)
                                    .then((currStudent) => {
                                        const defaultEmail = emailService.getDefaultEmail(Email.EmailType.STUDENT_PUSH_QUEUE, [
                                            actualCourse.description,
                                            utils.formatDate(actualLecture.date),
                                        ]);
                                        emailService.sendCustomMail(
                                                currStudent.email,
                                                defaultEmail.subject,
                                                defaultEmail.message)
                                            .then(() => {
                                                resolve(retVal);
                                                return;
                                            })
                                            .catch((err) => {
                                                reject(new StandardErr('StudentService', StandardErr.errno.FAILURE, 'Email service not working', 500));
                                                return;
                                            });
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}
