/**
 * test suite for the ManagerService module
 * @author Appendini Lorenzo
 * @author Gastaldi Paolo
 */

"use strict";

const assert = require("assert").strict;

const dao = require("../src/db/Dao.js");
const service = require("../src/services/ManagerService.js");
const Student = require("../src/entities/Student.js");
const prepare = require("../src/db/preparedb.js");

const suite = function () {
    before(async function () {
        await dao.init("testing.db");
    });

    beforeEach(async function () {
        await prepare("testing.db", "testing.sql", false);
    });

    function validator(err, errno, message, statusCode) {
        const payload = err.payload;
        assert.equal(payload.errno, errno);
        assert(payload.message.includes(message));
        assert.equal(payload.statusCode, statusCode);
        assert.equal(payload.statusCode, err.statusCode);

        return true;
    }

    describe("ManagerService", function () {
        describe("managerGetCourseLecture", function () {
            it("Should have raised an error", async () => {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(service.managerGetCourseLecture({ managerId: "error" }), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have raised an error with wrong correlation as input", async () => {
                const errno = 11;
                const message = "not belong";
                const code = 404;
                await assert.rejects(
                    service.managerGetCourseLecture({ managerId: 1, courseId: 2, lectureId: 1 }),
                    (err) => validator(err, errno, message, code)
                );
            });

            it("Should have returned lecture with id 1", async () => {
                const ret = await service.managerGetCourseLecture({ managerId: 1, courseId: 1, lectureId: 1 });
                assert.strictEqual(ret.lecture.lectureId, 1);
            });
        });

        describe("managerGetCourseLectures", function () {
            it("Should have raised an error", async () => {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(service.managerGetCourseLectures({ managerId: "error" }), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have returned an array", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                assert.equal(lectures.constructor, Array);
            });

            it("Should have returned an array of length 2", async () => {
                const lectures = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                assert.equal(lectures.length, 2);
            });

            it("Should have returned an array of elements", async () => {
                const ret = await service.managerGetCourseLectures({ managerId: 1, courseId: 1 });
                const expected = [1, 4];
                ret.forEach((elem,index) => assert.equal(elem.lecture.lectureId, expected[index]));
            });

            it("Should have returned an array of elements with query", async () => {
                const ret = await service.managerGetCourseLectures(
                    { managerId: 1, courseId: 1 },
                    { bookings: true, cancellations: true, attendances:true }
                );
                const expectedBookings = [1, 1];
                const expectedCancellations = [0, 0];
                const expectedAttendances = [0, 0];
                ret.forEach((elem,index) => {
                    assert.equal(elem.bookings, expectedBookings[index])
                    assert.equal(elem.cancellations, expectedCancellations[index])
                    assert.equal(elem.attendances, expectedAttendances[index])
                })
            });

            it("Should have returned an array of elements with query 2", async () => {
                const ret = await service.managerGetCourseLectures(
                    { managerId: 1, courseId: 6 },
                    { bookings: true, cancellations: true, attendances:true }
                );
                const expectedLectures = [5, 6]
                const expectedBookings = [2, 1];
                const expectedCancellations = [0, 0];
                const expectedAttendances = [2, 0];
                ret.forEach((elem,index) => {
                    assert.equal(elem.lecture.lectureId, expectedLectures[index])
                    assert.equal(elem.bookings, expectedBookings[index])
                    assert.equal(elem.cancellations, expectedCancellations[index])
                    assert.equal(elem.attendances, expectedAttendances[index])
                })
            });
        });

        describe("managerGetCourses", function () {
            it("Should have raised an error", async () => {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(service.managerGetCourses({ managerId: "error" }), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have returned an array", async () => {
                const courses = await service.managerGetCourses({ managerId: 1 });
                assert.equal(courses.constructor, Array);
            });

            it("Should have returned an array of length 6", async () => {
                const courses = await service.managerGetCourses({ managerId: 1 });
                assert.equal(courses.length, 6);
            });

            it("Should have returned an array of elements", async () => {
                const ret = await service.managerGetCourses({ managerId: 1 });
                const expected = [1, 2, 3, 4, 5, 6];
                ret.forEach((course ,index) => assert.equal(course.courseId, expected[index]));
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

module.exports = suite;
