"use strict";

class EmailQueue {
    /**
     * 
     * @param {Number} queueId 
     * @param {String} sender 
     * @param {String} recipient 
     * @param {String} emailType 
     * @param {Number} teacherId 
     * @param {Number} studentId 
     * @param {Number} courseId 
     * @param {String} courseName 
     * @param {Number} lectureId 
     * @param {Date} startingDate 
     */
    constructor(queueId, sender, recipient, emailType, teacherId, studentId, courseId, courseName, lectureId, startingDate) {
        this.queueId = queueId;
        this.sender = sender;
        this.recipient = recipient;
        this.emailType = emailType;
        this.teacherId = teacherId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.lectureId = lectureId;
        this.startingDate = startingDate;
    }

    /**
     * create a new course from a generic object
     * @param {Object} obj
     * @returns {Course} new course
     */
    static from(obj) {
        const emailQueue = Object.assign(new EmailQueue(), obj);
        return emailQueue;
    }
}

module.exports = EmailQueue;
