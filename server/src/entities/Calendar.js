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
     * @param {Date|String} from
     * @param {Date|String} to 
     * @param {CalendaType} type 
     */
    constructor(calendarId = -1, from = new Date(), to = new Date(), type = CalendarType.UNDEFINED) {
        this.calendarId = calendarId;
        this.from = new Date(from);
        this.to = new Date(to);
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
        FIRST_SEMESTER : {
            text : 'FIRST_SEMESTER',
            isAValidPeriod : true
        },
        SECOND_SEMESTER : {
            text : 'SECOND_SEMESTER',
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
        calendar.from = new Date(calendar.from);
        calendar.to = new Date(calendar.to);

        return calendar;
    }
}
module.exports = Calendar;
