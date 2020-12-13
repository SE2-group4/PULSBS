/**
 * Waiting list entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class WaitingList {
    /**
     * class constructor
     * @param {Number} studentId 
     * @param {Number} lectureId 
     * @param {Date} date 
     */
    constructor(studentId, lectureId, date) {
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = new Date(date);
    }

    /**
     * create a new waiting list from a generic object
     * @param {Object} obj
     * @returns {waitingList} new waiting list
     */
    static from(obj) {
        const waitingList = Object.assign(new waitingList(), obj);
        return waitingList;
    }
}

module.exports = WaitingList;
