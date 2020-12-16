/**
 * test suite for the ManagerService module
 * @author Appendini Lorenzo
 * @author Gastaldi Paolo
 */

"use strict";

const assert = require("assert");
const path = require("path");

const dao = require("../src/db/Dao.js");
const service = require("../src/services/ManagerService.js");
const Student = require("../src/entities/Student.js");
const Teacher = require("../src/entities/Teacher.js");
const Lecture = require("../src/entities/Lecture.js");
const Course = require("../src/entities/Course.js");
const EmailType = require("../src/entities/EmailType.js");
const Email = require("../src/entities/Email.js");
const prepare = require("../src/db/preparedb.js");
const { italic } = require("colors");

const suite = function () {
    before(function (done) {
        dao.init("testing.db");
        done();
    });

    beforeEach(function (done) {
        reset(done);
    });

    const reset = (done) => {
        prepare("testing.db", "testing.sql", false)
            .then(() => done())
            .catch((err) => done(err));
    };

    describe("ManagerService", function () {

        describe("managerGetCourseLecture", function () {
            it("Should have thrown an error", async () => {
                await assert.rejects(service.managerGetCourseLecture({ managerId: "error" }));
            });

            it("Should have returned lecture with id 1", async () => {
                const lectureObj = await service.managerGetCourseLecture({ managerId: 1, courseId: 1, lectureId: 1 });
                assert.strictEqual(lectureObj.lecture.lectureId, 1);
            });
        });

        describe("managerGetCourseLectures", function () {
            it("Should have thrown an error", async () => {
                await assert.rejects(service.managerGetCourseLectures({ managerId: "error" }));
            });

            it("Should have returned an array", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                assert(lectures.constructor === Array);
            });

            it("Should have returned an array of length", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                assert.strictEqual(lectures.length, 2);
            });

            it("Should have returned an array of elements", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                const expected = [1, 4];
                for(let i = 0; i < expected.length; i++) {
                    assert.strictEqual(lectures[i].lecture.lectureId, expected[i]);
                }
            });

            it("Should have returned an array of elements + bookings", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 }, {bookings: true});
                const expectedBookings = [1, 1];
                for(let i = 0; i < expectedBookings.length; i++) {
                    assert(lectures[i].bookings, expectedBookings[i]);
                }
            });

        });

        describe("managerGetCourses", function () {
            it("Should have thrown an error", async () => {
                await assert.rejects(service.managerGetCourses({ managerId: "error" }));
            });

            it("Should have returned an array", async () => {
                const courses = await service.managerGetCourses({ managerId: 1 });
                assert(courses.constructor === Array);
            });

            it("Should have returned an array of length", async () => {
                const courses = await service.managerGetCourses({ managerId: 1 });
                assert.strictEqual(courses.length, 6);
            });

            it("Should have returned an array of elements", async () => {
                const courses = await service.managerGetCourses({ managerId: 1 });
                const expected = [1, 2, 3, 4, 5, 6];
                for(let i = 0; i < courses.length; i++) {
                    assert.strictEqual(courses[i].courseId, expected[i]);
                }
            });

        });

        describe("managerGetStudent", function () {
            it("correct serialNumber should return a student", function (done) {
                service
                    .managerGetStudent({ managerId: 1 }, { serialNumber: "1" })
                    .then((user) => {
                        assert.strictEqual(typeof user, typeof new Student(), "student received.");
                        done();
                    })
                    .catch((err) => done(err));
            });

            it("correct ssn should return a student", function (done) {
                service
                    .managerGetStudent({ managerId: 1 }, { ssn: "aldo1" })
                    .then((user) => {
                        assert.strictEqual(typeof user, typeof new Student(), "student received.");
                        done();
                    })
                    .catch((err) => done(err));
            });

            it("correct serialNumber should not return a teacher", function (done) {
                service
                    .managerGetStudent({ managerId: 1 }, { serialNumber: "4" })
                    .then((user) => {
                        done("No user should be returned");
                    })
                    .catch((err) => done()); //ok
            });

            it("non existing user should fail the request", function (done) {
                service
                    .managerGetStudent({ managerId: 1 }, { ssn: "invalid" })
                    .then((user) => {
                        done("No user should be returned");
                    })
                    .catch((err) => done()); //ok
            });

            it("no query should fail the request", function (done) {
                service
                    .managerGetStudent({ managerId: 1 }, {})
                    .then((user) => {
                        done("No user should be returned");
                    })
                    .catch((err) => done()); //ok
            });
        });

        describe("managerGetReport", function () {
            it("correct params should return a list of users", function (done) {
                service
                    .managerGetReport({ managerId: 1, serialNumber: 1 }, {})
                    .then((users) => {
                        assert.strictEqual(users.length, 2, "Wrong number of users");
                        done();
                    })
                    .catch((err) => done(err));
            });

            it("non existing student should return an empty list", function (done) {
                service
                    .managerGetReport({ managerId: 1, serialNumber: -1 }, {})
                    .then((users) => {
                        assert.strictEqual(users.length, 0, "Wrong number of users");
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
};

suite();
module.exports = suite;

