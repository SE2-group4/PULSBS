/**
 * test suite for the TeacherService module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const dao = require('../src/db/Dao.js');
const Student = require('../src/entities/Student.js');
const Teacher = require('../src/entities/Teacher.js');
const Lecture = require('../src/entities/Lecture.js');
const Course = require('../src/entities/Course.js');
const EmailType = require('../src/entities/EmailType.js');
const Email = require('../src/entities/Email.js');
const prepare = require('../src/db/preparedb.js');

const suite = function() {
    describe('TeacherService', function() {
        describe('teacherGetCourseLectureStudents', function() {

        });

        describe('teacherGetCourseLectures', function() {

        });

        describe('teacherGetCourses', function() {

        });

        describe('isCourseTeachedBy', function() {

        });

        describe('doesLectureBelongCourse', function() {

        });

        describe('nextCheck', function() {

        });

        describe('checkForExpiredLectures', function() {

        });
    });
}
module.exports = suite;