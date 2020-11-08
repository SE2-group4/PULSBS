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
     */
    constructor(studentId = -1, firstName = null, lastName = null, email = null, password = null) {
        super(studentId, firstName, lastName, email, password);
        this.studentId = studentId;
    }

    /**
     * create a new student from a generic object
     * @param {Object} obj
     * @returns {Student} new student
     */
    static from(obj){
        const student = Object.assign(new Student(), obj);
        student.password = null; // default security option
        return student;
    }
}

module.exports = Student;