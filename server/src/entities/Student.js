/**
 * Student entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Student {
    constructor(studenId = -1, firstName = null, lastName = null, email = null, password = null) {
        this.studenId = studenId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
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