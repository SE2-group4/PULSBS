/**
 * Lecture entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Lecture {
    /**
     * constructor
     * @param {Number} lectureId 
     * @param {Number} courseId 
     * @param {Number} classId 
     * @param {Date} date 
     */
    constructor(lectureId = -1, courseId = -1, classId = -1, date = undefined, bookingDeadline = undefined) {
        date = new Date(date);
        bookingDeadline = new Date(bookingDeadline);

        this.lectureId = lectureId;
        this.courseId = courseId;
        this.classId = classId;
        this.date = date;
        this.bookingDeadline = bookingDeadline;
    }

    /**
     * create a new lecture from a generic object
     * @param {Object} obj
     * @returns {Lecture} new lecture
     */
    static from(obj){
        const lecture = Object.assign(new Lecture(), obj);
        lecture.date = new Date(lecture.date);
        lecture.bookingDeadline = new Date(lecture.bookingDeadline);
        return lecture;
    }
}

module.exports = Lecture;
