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
     */
    constructor(emailId = -1, from = null, to = null, date = new Date(), emailType = EmailType.UNDEFINED, subject = '', body = '') {
        this.emailId = emailId;
        this.from = from;
        this.to = to;
        this.date = date;
        this.emailType = emailType;
        this.subject = subject;
        this.body = body;
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