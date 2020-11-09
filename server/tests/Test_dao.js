/**
 * test suite for the dao module
 * @author Gastaldi Paolo
 */

'use strict'

const { fail } = require('assert');
const assert = require('assert');

const dao = require('./../db/Dao.js');

const suite = describe('Dao.js', function() {
    before(function() {

    });

    beforeEach(function(done) {
        prepare(done, false);
    });

    describe('login', function() {
        it('correct data should perform login', function(done) {
            
        });

        it('incorrect data should not perform login', function(done) {
            
        });
    });

    describe('addBooking', function() {
        it('correct data should insert a new booking', function(done) {
            
        });
    });

    describe('getLecturesByStudent', function() {
        it('non empty lecture should get the list of students', function(done) {
            
        });
    });

    describe('getCoursesByStudent', function() {
        it('non empty course should get the list of students', function(done) {
            
        });
    });

    describe('getLecturesByCourse', function() {
        it('non empty course should get the list of lectures', function(done) {
            
        });
    });

    describe('getStudentsByLecture', function() {
        it('non empty lecture should get the list of students', function(done) {
            
        });
    });

    describe('getStudentsByCourse', function() {
        it('non empty coure should get the list of students', function(done) {
            
        });
    });

    describe('getLecturesByTeacher', function() {
        it('non empty teacher should get the list of lectures', function(done) {
            
        });
    });

    describe('getCoursesByTeacher', function() {
        it('non empty teacher should get the list of courses', function(done) {
            
        });
    });

    describe('_createStudentBookingEmail', function() {
        it('correct data should get a student email', function(done) {
            
        });
    });

    describe('_createTeacherBookingsEmail', function() {
        it('correct data should get a teacher email', function(done) {
            
        });
    });

    describe('_getCurrentAcademicYear', function() {
        it('should get this year', function(done) {
            
        });
    });

    describe('addEmail', function() {
        it('correct data should insert a new email', function(done) {
            
        });
    });
});

module.exports = suite;