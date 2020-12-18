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

    static CalendaType = {
        UNDEFINED : 'UNDEFINED',
        ACADEMIC_YEAR : 'ACADEMIC_YEAR',
        SEMESTER : 'SEMESTER',
        FIRST_SEMESTER : 'FIRST_SEMESTER',
        SECOND_SEMESTER : 'SECOND_SEMESTER',
        HOLIDAYS : 'HOLIDAYS'
        // add more here
    }

    /**
     * create a new calendar from a generic object
     * @param {Object} obj
     * @returns {Calendar} new class
     */
    static from(obj) {
        const calendar = Object.assign(new Calendar(), obj);
        return calendar;
    }
}
module.exports = Calendar;
