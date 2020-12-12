/**
 * Class entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Class {
    constructor(classId = -1, description = null, nSeats = 0) {
        this.classId = classId;
        this.description = description;
        this.nSeats = nSeats;
    }

    /**
     * create a new class from a generic object
     * @param {Object} obj
     * @returns {Class} new class
     */
    static from(obj) {
        const new_class = Object.assign(new Class(), obj);
        return new_class;
    }
}

module.exports = Class;
