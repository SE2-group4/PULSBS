"use strict";

class EmailQueue {
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
