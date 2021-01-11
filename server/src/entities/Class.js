/**
 * Class entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Class {
    /**
     * class constructor
     * @param {Number} classId
     * @param {String} description - correspond to Schedule.roomId
     * @param {Number} capacity 
     */
    constructor(classId = -1, description = null, capacity = 0) {
        this.classId = classId;
        this.description = description;
        this.capacity = capacity;
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
