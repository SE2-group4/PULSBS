/**
 * Calendar entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Calendar {
    /**
     * class constructor
     * @param {Number} calendarId 
     * @param {Date|String} startingDate
     * @param {Date|String} endingDate 
     * @param {CalendaType} type 
     */
    constructor(calendarId = -1, startingDate = new Date(), endingDate = new Date(), type = Calendar.CalendarType.UNDEFINED) {
        this.calendarId = calendarId;
        this.startingDate = new Date(startingDate);
        this.endingDate = new Date(endingDate);
        this.type = type;
    }

    /**
     * for each type you can use:
     * - text: a string description of this type
     * - isAValidPeriod: if true, consider it as a whitelist, else as a blacklist
     */
    static CalendarType = {
        UNDEFINED : {
            text : 'UNDEFINED',
            isAValidPeriod : false
        },
        ACADEMIC_YEAR : {
            text : 'ACADEMIC_YEAR',
            isAValidPeriod : true
        },
        SEMESTER : {
            text : 'SEMESTER',
            isAValidPeriod : true
        },
        HOLIDAYS : {
            text : 'HOLIDAYS',
            isAValidPeriod : false
        }
        // add more here
    }

    /**
     * create a new calendar from a generic object
     * @param {Object} obj
     * @returns {Calendar} new calendar
     */
    static from(obj) {
        const calendar = Object.assign(new Calendar(), obj);
        calendar.type = {
            text : calendar.type,
            isAValidPeriod : calendar.isAValidPeriod
        };
        calendar.startingDate = new Date(calendar.startingDate);
        calendar.endingDate = new Date(calendar.endingDate);

        return calendar;
    }
}
module.exports = Calendar;
