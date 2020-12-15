/**
 * Enrollment entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Enrollment {
    /**
     * class constructor
     * @param {Number} studentId 
     * @param {Number} courseId 
     * @param {Number} year - initial academic year of enrollment (eg. 2020 = the student has been enrolled for the academic year 2020-2021)
     */
    constructor(studentId = -1, courseId = -1, year = 0) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.year = year;
    }

    /**
     * create a new Enrollment from a generic object
     * @param {Object} obj
     * @returns {Enrollment} new enrollment
     */
    static from(obj) {
        const enrollment = Object.assign(new Enrollment(), obj);
        return enrollment;
    }
}

module.exports = Enrollment;
