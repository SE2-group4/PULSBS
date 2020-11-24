/**
 * all service unit tests
 * @author Gastaldi Paolo
 */
'use strict';

const Test_GeneralService = require('./Test_GeneralService');
const Test_StudentService = require('./Test_StudentService');
const Test_TeacherService = require('./Test_TeacherService');
const Test_email = require('./Test_email.js');

/**
 * all system unit test
 */
describe('Services', function () {
    Test_GeneralService();
    Test_StudentService();
    Test_TeacherService();
    Test_email();
})