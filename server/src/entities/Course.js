/**
 * Course entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

class Course {
    constructor(courseId = -1, description = null, year = -1) {
        this.courseId = courseId;
        this.description = description;
        this.year = year;
    }

    /**
     * create a new course from a generic object
     * @param {Object} obj
     * @returns {Course} new course
     */
    static from(obj){
        const course = Object.assign(new Course(), obj);
        return course;
    }
}

module.exports = Course;
