"use strict";

const assert = require("assert").strict;
const path = require("path");

const Dao = require("../src/db/Dao.js");
const Service = require("../src/services/TeacherService.js");
const Lecture = require("../src/entities/Lecture.js");
const { ResponseError } = require("../src/utils/ResponseError.js");
const prepare = require("../src/db/preparedb.js");
const moment = require("moment");

const testSuiteTeacherService = () => {
    describe("TeacherService", function () {
        before(async function openDb() {
            await Dao.init("testing.db");

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

        after(async function openDb() {
            await prepare("testing.db", "testTeacherServices.sql", false);
            //Dao.closeConn();
        });

        let tBBBStError;

        let tGGGLectCancError;
        const tBBBSt = {
            input: ["foo", "bar", "zab"],
            error: tBBBStError,
        };

        const tBBBSem = {
            input: [5, 1, 4],
            error: tBBBStError,
        };
        const tGBBSem = {
            input: [4, 1, 4],
            error: tBBBStError,
        };
        const tGGG1St = {
            input: [4, 2, 4],
            error: tBBBStError,
        };
        const tGGG1Emp = {
            input: [4, 1, 2],
            error: tBBBStError,
        };
        const tGGGFilter1Book = {
            input: [4, 1, { from: "inf", to: moment().startOf("day").toISOString(), bookings: "true" }],
            error: tBBBStError,
        };
        const tGGGLectNotCanc = {
            input: [4, 1, 1],
            error: tBBBStError,
        };
        const tGGGLectCanc = {
            input: [4, 1, 2],
            error: tGGGLectCancError,
        };
        const tGGGSwitchTo = {
            input: [4, 1, 2, "remote"],
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
                        moment().subtract(1, "day").startOf("day").hours(8).minutes(30).toISOString(),
                        5400000,
                        moment().subtract(2, "day").startOf("day").hours(23).minutes(59).toISOString(),
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
            Map: {
                type: "Should have returned a Map",
                length: "Should have returned a Map of length",
                key: "Should have returned a Map with keys",
            },
            General: {
                nextCheck: "",
                length: "Should have returned an Array of length",
            },
        };

        function validator(err, errno, message, statusCode) {
            const payload = err.payload;
            assert.equal(payload.errno, errno);
            assert(payload.message.includes(message));
            assert.equal(payload.statusCode, statusCode);
            assert.equal(payload.statusCode, err.statusCode);

            return true;
        }

        describe("teacherGetCourses", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type, async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;

                await assert.rejects(Service.teacherGetCourses(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Array.type + " of Courses", async function () {
                const res = await Service.teacherGetCourses(...tGGG1St.input);
                assert.equal(res.constructor, Array);
            });

            it(errorMsg.Array.length + " 2", async function () {
                const expLength = 2;
                const expCourseIds = [1, 2];
                const res = await Service.teacherGetCourses(...tGGG1St.input);

                assert.equal(res.length, expLength);
                res.forEach((course, index) => assert.equal(course.courseId, expCourseIds[index]));
            });
        });

        describe("teacherGetCourseLectureStudents", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type + " with string as input", async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherGetCourseLectureStudents(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.ResponseError.type + " with wrong withStatus", async function () {
                const errno = 1;
                const message = "not a boolean";
                const code = 400;
                await assert.rejects(Service.teacherGetCourseLectureStudents(4, 1, 1, ""), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.ResponseError.type + " with wrong correlation as input", async function () {
                const errno = 11;
                const message = "not belong";
                const code = 404;

                await assert.rejects(Service.teacherGetCourseLectureStudents(...tGBBSem.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Array.type, async function () {
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1St.input);
                assert.equal(res.constructor, Array);
            });

            it(errorMsg.Array.length + " 3", async function () {
                const expLength = 3;
                const expStudentIds = [1, 2, 3];
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1St.input);
                assert.equal(res.length, expLength);
                res.forEach((student, index) => assert.equal(student.studentId, expStudentIds[index]));
            });

            it("Should have returned the status of each student's booking", async function () {
                const expBookingStatuses = ["PRESENT", "BOOKED", "NOT_PRESENT"];
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1St.input, "true");
                res.forEach((elem, index) => assert.equal(elem.bookingStatus, expBookingStatuses[index]));
            });

            it(errorMsg.Array.length + " 0", async function () {
                const expLength = 0;
                const res = await Service.teacherGetCourseLectureStudents(...tGGG1Emp.input);
                assert.equal(res.length, expLength);
            });
        });

        describe("teacherGetCourseLectures", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type + " with string as input", async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherGetCourseLectures(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.ResponseError.type + " with wrong correlation as input", async function () {
                const errno = 30;
                const message = "not taught";
                const code = 404;
                await assert.rejects(Service.teacherGetCourseLectureStudents(...tBBBSem.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Array.type, async function () {
                const res = await Service.teacherGetCourseLectures(4, 2);
                assert.equal(res.constructor, Array);
            });

            it(errorMsg.Array.length + " 3", async function () {
                const expLength = 3;
                const expLectureIds = [1, 2, 3];
                const res = await Service.teacherGetCourseLectures(4, 1);
                assert.equal(res.length, expLength);
                res.forEach((elem, index) => assert.equal(elem.lecture.lectureId, expLectureIds[index]));
            });

            it(errorMsg.Array.length + " 1", async function () {
                const expLength = 1;
                const expLectureIds = [1];
                const res = await Service.teacherGetCourseLectures(...tGGGFilter1Book.input);
                assert.equal(res.length, expLength);
                res.forEach((elem, index) => assert.equal(elem.lecture.lectureId, expLectureIds[index]));
            });

            it("Should have returned tot bookings 1", async function () {
                const expBookings = [1];
                const res = await Service.teacherGetCourseLectures(...tGGGFilter1Book.input);
                res.forEach((elem, index) => assert.equal(elem.bookings, expBookings[index]));
            });

            it("Should have returned correct tot attendances", async function () {
                const expAttendances = [1, 0, 0];
                const res = await Service.teacherGetCourseLectures(4, 1, { attendances: "true" });
                res.forEach((elem, index) => assert.equal(elem.attendances, expAttendances[index]));
            });

            it("Should have returned correct tot attendances var", async function () {
                const expAttendances = [1];
                const res = await Service.teacherGetCourseLectures(4, 2, { attendances: "true" });
                res.forEach((elem, index) => assert.equal(elem.attendances, expAttendances[index]));
            });
        });

        describe("teacherGetCourseLecture", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type, async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherGetCourseLecture(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Lecture.type, async function () {
                const res = await Service.teacherGetCourseLecture(...tGGG1St.input);
                assert.equal(res.constructor, Lecture);
            });

            it(errorMsg.Lecture.examples.message, async function () {
                const res = await Service.teacherGetCourseLecture(4, 1, 1);
                assert.deepStrictEqual(res, errorMsg.Lecture.examples.notCancellable);
            });
        });

        describe("teacherDeleteCourseLecture", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type, async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherDeleteCourseLecture(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Integer.type, async function () {
                const res = await Service.teacherDeleteCourseLecture(...tGGGLectCanc.input);
                assert.strictEqual(res, 204);
            });

            it(errorMsg.Lecture.notCancellable, async function () {
                const errno = 23;
                const message = "not cancellable";
                const code = 409;
                await assert.rejects(Service.teacherDeleteCourseLecture(...tGGGLectNotCanc.input), (err) =>
                    validator(err, errno, message, code)
                );
            });
        });

        describe("teacherUpdateCourseLectureStudentStatus", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type, async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherUpdateCourseLectureStudentStatus(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have raised an error with a wrong booking status as input", async function () {
                const errno = 50;
                const message = "not accepted";
                const code = 400;
                await assert.rejects(Service.teacherUpdateCourseLectureStudentStatus(5, 3, 5, 3, ""), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should not have updated the booking status of the student", async function () {
                const errno = 52;
                const message = "not updatable";
                const code = 400;
                await assert.rejects(Service.teacherUpdateCourseLectureStudentStatus(5, 3, 5, 3, "present"), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have updated the booking status of the student", async function () {
                assert.equal(await Service.teacherUpdateCourseLectureStudentStatus(4, 1, 1, 1, "not_present"), 204);
            });
        });

        describe("teacherUpdateCourseLectureDeliveryMode", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.ResponseError.type, async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(...tBBBSt.input), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it(errorMsg.Integer.type, async function () {
                const res = await Service.teacherUpdateCourseLectureDeliveryMode(...tGGGSwitchTo.input);
                assert.strictEqual(res, 204);
            });

            it("Should not have switched the lecture with expired lecture", async function () {
                const errno = 24;
                const message = "not switchable";
                const code = 409;
                await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(4, 1, 1, "remote"), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should not have switched the lecture", async function () {
                const errno = 24;
                const message = "not switchable";
                const code = 409;
                await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(4, 1, 1, "presence"), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have raised an error with a wrong switchTo as input", async function () {
                const errno = 22;
                const message = "not valid";
                const code = 400;
                await assert.rejects(Service.teacherUpdateCourseLectureDeliveryMode(4, 1, 1, ""), (err) =>
                    validator(err, errno, message, code)
                );
            });
        });

        describe("nextCheck", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it("Should have returned the time difference between today's 23:00 and today's 23:59 (local)", async function () {
                const diff = 59 * 60 * 1000;
                const res = Service.nextCheck(moment().startOf("day").hours(23).toDate());
                assert.equal(res, diff);
            });

            it("Should have returned the time difference between today's 23:59 and tomorrow's 23:59 (local)", async function () {
                const diff = 24 * 60 * 60 * 1000;
                //const diff = 23 * 60 * 60 * 1000 + 59 * 60 * 1000;
                const res = Service.nextCheck(moment().startOf("day").hours(23).minutes(59).toDate());
                assert.equal(res, diff);
            });

            it("Should have returned the time difference between today's 23:59:01 and tomorrow's 23:59:00 (local)", async function () {
                const diff = 24 * 60 * 60 * 1000 - 1 * 1000;
                const res = Service.nextCheck(moment().startOf("day").hours(23).minutes(59).seconds(1).toDate());
                assert.equal(res, diff);
            });

            it("Should have returned the time difference between today's 00:00 and today's 23:59 (local)", async function () {
                const diff = 23 * 60 * 60 * 1000 + 59 * 60 * 1000;
                const res = Service.nextCheck(moment().startOf("day").toDate());
                assert.equal(res, diff);
            });
        });

        describe("findSummaryExpiredLectures", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testTeacherServices.sql", false);
            });

            it(errorMsg.Map.type, async function () {
                const ret = await Service._findSummaryExpiredLectures();
                assert.strictEqual(ret.constructor, Map);
            });

            it(errorMsg.Map.length + " 1", async function () {
                const ret = await Service._findSummaryExpiredLectures();
                const iter = ret.keys();
                let count = 0;
                while (iter.next().value) count++;
                assert.equal(count, 1);
            });
        });
    });
};

module.exports = testSuiteTeacherService;
