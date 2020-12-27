/**
 * Teacher entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const User = require('./User.js');

class Teacher extends User {
    /**
     * class constructor
     * @param {Number} teacherId 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} email 
     * @param {String} password 
     */
    constructor(teacherId = -1, firstName = null, lastName = null, email = null, password = null, ssn = null, serialNumber = null) {
        super(teacherId, firstName, lastName, email, password, ssn, serialNumber);
        this.teacherId = teacherId;
    }

    /**
     * create a new teacher from a generic object
     * @param {Object} obj
     * @returns {Teacher} new teacher
     */
    static from(obj){
        const teacher = Object.assign(new Teacher(), obj);
        if(obj.userId)
            teacher.teacherId = obj.userId;
        teacher.password = null; // default security option
        return teacher;
    }

    static getComparator(field) {
        if (field === "serialNumber") return userComparatorBySerialNumber;
        return null;
    }
}

function userComparatorBySerialNumber(a, b) {
    if (a.serialNumber < b.serialNumber) {
        return -1;
    }

    if (a.serialNumber > b.serialNumber) {
        return 1;
    }
    return 0;
}

module.exports = Teacher;
