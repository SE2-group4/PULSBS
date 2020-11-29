/**
 * test suite for the TeacherService module
 */

"use strict";

const assert = require("assert");
const path = require("path");

const Dao = require("../src/db/Dao.js");
const Service = require("../src/services/TeacherService.js");
const Teacher = require("../src/entities/Teacher.js");
const Student = require("../src/entities/Student.js");
const Lecture = require("../src/entities/Lecture.js");
const { ResponseError } = require("../src/utils/ResponseError.js");
const prepare = require("../src/db/preparedb.js");
const moment = require("moment");

describe("TeacherService", function () {
    before(async function openDb() {
        Dao.init("testing.db");
        tBBBStError = new ResponseError(
            "TeacherService",
            ResponseError.PARAM_NOT_INT,
            { teacherId: tBBBSt.input[0] },
            400
        );
        tGGGLectCancError = new ResponseError(
            "TeacherService",
            ResponseError.PARAM_NOT_INT,
            { teacherId: tBBBSt.input[0] },
            400
        );
    });

    let tBBBStError;
    let tGGGLectCancError;
    const tBBBSt = {
        input: ["foo", "bar", "zab"],
        error: tBBBStError,
    };
    const tGBBSt = {
        input: [1, "bar", "zab"],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tBBBStError,
    };
    const tGGBSt = {
        input: [4, 1, "zab"],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tBBBStError,
    };
    const tGGG1St = {
        input: [4, 1, 1],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tBBBStError,
    };
    const tGGGLectNotCanc = {
        input: [4, 1, 1],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tBBBStError,
    };
    const tGGGLectCanc = {
        input: [4, 1, 2],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tGGGLectCancError,
    };
    const tGGGSwitchTo= {
        input: [4, 1, 2, "remote"],
        //error: new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId: tBBBSt.input[0] }, 400),
        error: tGGGLectCancError,
    };

    const errorMsg = {
        Array: {
            type: "Should have returned an Array",
            length: "Should have returned an Array of length",
        },
        Teacher: {
            type: "Should have returned a Teacher",
            length: "Should have returned an Array of length",
        },
        Student: {
            type: "Should have returned a Student",
            length: "Should have returned an Array of length",
        },
        Course: {
            type: "Should have returned an Course",
            length: "Should have returned an Array of length",
        },
        Lecture: {
            type: "Should have returned a Lecture",
            notCancellable: "Lecture should not be cancellable",
            notSwitchable: "Lecture should not be switchable",
            examples: {
                message: "The returned lecture does not match",
                cancellable: new Lecture(
                    1,
                    1,
                    1,
                    moment().add(1, "day").startOf("day").hours(8).minutes(30),
                    5400000,
                    moment().subtract(1, "day").startOf("day").hours(23).minutes(59),
                    "PRESENCE"
                ),
                notCancellable: new Lecture(
                    1,
                    1,
                    1,
                    moment().subtract(1, "day").startOf("day").hours(8).minutes(30),
                    5400000,
                    moment().subtract(2, "day").startOf("day").hours(23).minutes(59),
                    "PRESENCE"
                ),
            },
        },
        ResponseError: {
            type: "Should have throw a ResponseError",
            length: "Should have returned an Array of length",
        },
        Integer: {
            type: "Should have returned an Integer",
            length: "Should have returned an Array of length",
        },
        General: {
            nextCheck: "",
            length: "Should have returned an Array of length",
        },
    };

    describe("teacherGetCourses", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherGetCourses(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Array.type + " of Courses", async function () {
            try {
                const res = await Service.teacherGetCourses(...tGGG1St.input);
                assert(res.constructor === Array);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Array.length + " 2", async function () {
            try {
                const res = await Service.teacherGetCourses(...tGGG1St.input);
                assert.deepStrictEqual(res.length, 2);
            } catch (err) {
                assert.fail();
            }
        });
    });

    describe("teacherGetCourseLectureStudents", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherGetCourseLectureStudents(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Array.type + " of Students", async function () {
            try {
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1St.input);
                assert(res.constructor === Array);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Array.length + " 1", async function () {
            try {
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1St.input);
                assert.deepStrictEqual(res.length, 1);
            } catch (err) {
                assert.fail();
            }
        });
    });

    describe("teacherGetCourseLectures", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherGetCourseLectures(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Array.type + " of Lectures", async function () {
            try {
                const res = await Service.teacherGetCourseLectures(...tGGG1St.input);
                assert(res.constructor === Array);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Array.length + " 3", async function () {
            try {
                const res = await Service.teacherGetCourseLectures(...tGGG1St.input);
                assert.deepStrictEqual(res.length, 3);
            } catch (err) {
                assert.fail();
            }
        });
    });

    describe("teacherGetCourseLecture", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherGetCourseLecture(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Lecture.type, async function () {
            try {
                const res = await Service.teacherGetCourseLecture(...tGGG1St.input);
                assert(res.constructor === Lecture);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Lecture.examples.message, async function () {
            try {
                const res = await Service.teacherGetCourseLecture(...tGGG1St.input);
                assert.deepStrictEqual(res, errorMsg.Lecture.examples.notCancellable);
            } catch (err) {
                assert.fail();
            }
        });
    });

    describe("teacherDeleteCourseLecture", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherDeleteCourseLecture(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Integer.type, async function () {
            try {
                const res = await Service.teacherDeleteCourseLecture(...tGGGLectCanc.input);
                assert.strictEqual(res, 204);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Lecture.notCancellable, async function () {
            // TODO test pass even if tGGGLectCanc.error is not strictly equal to the rejected object
            //await assert.rejects(Service.teacherDeleteCourseLecture(...tGGGLectNotCanc.input), tGGGLectNotCanc.error);
            await assert.rejects(Service.teacherDeleteCourseLecture(...tGGGLectNotCanc.input));
        });
    });

    describe("teacherUpdateCourseLectureDeliveryMode", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it(errorMsg.ResponseError.type, async function () {
            await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(...tBBBSt.input), tBBBSt.error);
        });

        it(errorMsg.Integer.type, async function () {
            try {
                const res = await Service.teacherUpdateCourseLectureDeliveryMode(...tGGGSwitchTo.input);
                assert.strictEqual(res, 204);
            } catch (err) {
                assert.fail();
            }
        });

        it(errorMsg.Lecture.notSwitchable, async function () {
            // TODO still need to be implemented
            //await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(...tGGGLectNotCanc.input));
        });
    });

    describe("nextCheck", function () {
        beforeEach(async function clearDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
        });

        it("Wrong return value", async function () {
            // TODO weird things happening...
            const diff = 23 * 60 * 60 * 1000 + 59 * 60 * 1000;
            assert.strictEqual(Service.nextCheck(moment().startOf('day').toDate()), diff);
        });
    });
});

