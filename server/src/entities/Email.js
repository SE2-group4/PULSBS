/**
 * Email entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const EmailType = require('./EmailType.js');

class Email {
    /**
     * class constructor
     * @param {Number} emailId 
     * @param {Teacher | Student} from 
     * @param {Teacher | Student} to 
     * @param {EmailType} emailType 
     * @param {Date} date
     * @param {String} subject 
     * @param {String} body 
     * @param {Number} courseId
     * @param {Number} lectureId
     */
    constructor(emailId = -1, from = null, to = null, date = new Date(), emailType = EmailType.UNDEFINED, subject = '', body = '', courseId = -1, lectureId = -1) {
        this.emailId = emailId;
        this.from = from;
        this.to = to;
        this.date = date;
        this.emailType = emailType;
        this.subject = subject;
        this.body = body;
        this.courseId = courseId;
        this.lectureId = lectureId;
    }

    /**
     * type code for the email
     */
    static EmailType = {
        ERROR : -1,
        UNDEFINED : 0,
        STUDENT_NEW_BOOKING : 1,
        TEACHER_ATTENDING_STUDENTS : 2,
        LESSON_CANCELLED: "LESSON_CANCELLED"
        // add more here
    }

    /**
     * create a new email from a generic object
     * @param {Object} obj
     * @returns {Course} new course
     */
    static from(obj){
        const email = Object.assign(new Email(), obj);
        return email;
    }
}

module.exports = Email;
