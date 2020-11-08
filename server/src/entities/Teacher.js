/**
 * Teacher entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Teacher {
    constructor(teacherId = -1, firstName = null, lastName = null, email = null, password = null) {
        this.teacherId = teacherId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    /**
     * create a new teacher from a generic object
     * @param {Object} obj
     * @returns {Teacher} new teacher
     */
    static from(obj){
        const teacher = Object.assign(new Teacher(), obj);
        teacher.password = null; // default security option
        return teacher;
    }
}

module.exports = Teacher;