/**
 * all service unit tests
 * @author Gastaldi Paolo
 */
"use strict";

const Test_GeneralService = require("./Test_GeneralService.js");
const Test_StudentService = require("./Test_StudentService.js");
const Test_TeacherService = require("./Test_TeacherService.js");
const Test_ManagerService = require("./Test_ManagerService.js");
const Test_SupportOfficerService = require("./Test_SupportOfficerService.js");
const Test_email = require("./Test_email.js");

/**
 * all system unit test
 */

const suite = function () {
    describe("Services", function () {
        Test_GeneralService();
        Test_StudentService();
        Test_TeacherService();
        Test_SupportOfficerService();
        Test_ManagerService();
        Test_email();
    });
};
module.exports = suite;
