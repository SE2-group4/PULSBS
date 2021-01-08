/**
 * Course entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

class Course {
    /**
     * class constructor
     * @param {Number} courseId
     * @param {String} description
     * @param {Number} year - relative year (eg. 1 = first year of the master degree)
     * @param {Number} semester
     * @param {String} code
     */
    constructor(courseId = -1, description = null, year = -1, semester = -1, code = -1) {
        this.courseId = courseId;
        this.description = description;
        this.year = year;
        this.semester = semester;
        this.code = code;
    }

    /**
     * create a new course from a generic object
     * @param {Object} obj
     * @returns {Course} new course
     */
    static from(obj) {
        const course = Object.assign(new Course(), obj);
        return course;
    }

    static getComparator(field) {
        if (field === "code") return courseComparatorByCode;
        return null;
    }
}

function courseComparatorByCode(a, b) {
    if (a.code < b.code) {
        return -1;
    }
    if (a.code > b.code) {
        return 1;
    }
    return 0;
}

module.exports = Course;
