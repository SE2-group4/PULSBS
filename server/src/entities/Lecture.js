/**
 * Lecture entity
 * @author Gastaldi Paolo
 * @version 1.0.2
 */
"use strict";

class Lecture {
    /**
     * constructor
     * @param {Number} lectureId
     * @param {Number} courseId
     * @param {Number} classId
     * @param {Date} startingDate
     * @param {Number} duration - milliseconds
     * @param {Date} bookingDeadline
     * @param {DeliveryType} delivery
     */
    constructor(
        lectureId = -1,
        courseId = -1,
        classId = -1,
        startingDate = undefined,
        duration = -1,
        bookingDeadline = undefined,
        delivery = Lecture.DeliveryType.ERROR
    ) {
        startingDate = new Date(startingDate);
        bookingDeadline = new Date(bookingDeadline);

        this.lectureId = lectureId;
        this.courseId = courseId;
        this.classId = classId;
        this.startingDate = startingDate;
        this.duration = duration;
        this.bookingDeadline = bookingDeadline;
        this.delivery = delivery;
    }

    /**
     * how the lecture will be delivered
     */
    static DeliveryType = {
        ERROR: "ERROR",
        UNDEFINED: "UNDEFINED",
        PRESENCE: "PRESENCE",
        REMOTE: "REMOTE",
        // add more here
    };

    /**
     * create a new lecture from a generic object
     * @param {Object} obj
     * @returns {Lecture} new lecture
     */
    static from(obj) {
        const lecture = Object.assign(new Lecture(), obj);
        lecture.startingDate = new Date(lecture.startingDate);
        lecture.bookingDeadline = new Date(lecture.bookingDeadline);
        return lecture;
    }

    /**
     * copy only existings properties from copyFrom
     * @param {Object} copyFrom
     * @returns {Lecture} new lecture
     */
    static create(copyFrom) {
        const lecture = new Lecture();
        Object.keys(copyFrom)
            .filter((key) => key in lecture)
            .forEach((key) => (lecture[key] = copyFrom[key]));
        lecture.startingDate = new Date(lecture.startingDate);
        lecture.bookingDeadline = new Date(lecture.bookingDeadline);
        return lecture;
    }
}

module.exports = Lecture;
