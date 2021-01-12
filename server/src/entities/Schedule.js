/**
 * Schedule entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const moment = require('moment');

class Schedule {
    /**
     * class constructor
     * @param {Number} scheduleId
     * @param {String} code
     * @param {Number} AAyear
     * @param {Number} semester
     * @param {Number} roomId
     * @param {Number} seats
     * @param {String} dayOfWeek
     * @param {String} startingTime
     * @param {String} endingTime
     */
    constructor(
        scheduleId = -1,
        code = "",
        AAyear = -1,
        semester = -1,
        roomId = -1,
        seats = 0,
        dayOfWeek = "",
        startingTime = "",
        endingTime = ""
    ) {
        this.scheduleId = scheduleId;
        this.code = code;
        this.AAyear = AAyear;
        this.semester = semester;
        this.roomId = roomId;
        this.seats = seats;
        this.dayOfWeek = dayOfWeek;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
    }

    /**
     * create a new schedule from a generic object
     * @param {Object} obj
     * @returns {Schedule} new schedule
     */
    static from(obj) {
        const schedule = Object.assign(new Schedule(), obj);

        // adapt dates
        const initDate = moment(schedule.startingTime, 'HH:mm');
        if(initDate.isValid()) {
            schedule.startingTime = initDate.format('HH:mm');
        }
        else
            schedule.startingTime = null;
        const finiDate = moment(schedule.endingTime, 'HH:mm');
        if(finiDate.isValid()) {
            schedule.endingTime = finiDate.format('HH:mm');
        }
        else
            schedule.endingTime = null;

        return schedule;
    }
}

module.exports = Schedule;

