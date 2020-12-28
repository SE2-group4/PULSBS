/**
 * Student entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

const User = require('./User.js');

class Student extends User {
    /**
     * class constructor
     * @param {Number} studentId 
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} email 
     * @param {String} password
     * @param {String} ssn
     */
    constructor(studentId = -1, firstName = null, lastName = null, email = null, password = null, ssn = null) {
        super(studentId, firstName, lastName, email, password, ssn);
        this.studentId = studentId;
    }

    /**
     * create a new student from a generic object
     * @param {Object} obj
     * @returns {Student} new student
     */
    static from(obj){
        const student = Object.assign(new Student(), obj);
        if(obj.userId)
            student.studentId = obj.userId;
        student.password = null; // default security option
        return student;
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

module.exports = Student;
