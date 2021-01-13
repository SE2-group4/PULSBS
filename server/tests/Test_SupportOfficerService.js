/**
 * test suite for the SupportOfficerService module
 */
"use strict";

const assert = require("assert").strict;

const Dao = require("../src/db/Dao.js");
const Service = require("../src/services/SupportOfficerService.js");
const prepare = require("../src/db/preparedb.js");
const Schedule = require("../src/entities/Schedule.js");
const Class = require("../src/entities/Class.js");

//TODO: finish schedules tests
const testSuiteSupportOfficer = () => {
    const stdEntities = [
        {
            Id: "900000",
            Name: "Ambra",
            Surname: "Ferri",
            City: "Poggio Ferro",
            OfficialEmail: "s900000@students.politu.it",
            Birthday: "1991-11-04",
            SSN: "MK97060783",
        },
        {
            Id: "900001",
            Name: "Gianfranco",
            Surname: "Trentini",
            City: "Fenestrelle",
            OfficialEmail: "s900001@students.politu.it",
            Birthday: "1991-11-05",
            SSN: "SP80523410",
        },
        {
            Id: "900002",
            Name: "Maria Rosa",
            Surname: "Pugliesi",
            City: "Villapiccola",
            OfficialEmail: "s900002@students.politu.it",
            Birthday: "1991-11-05",
            SSN: "ZO70355767",
        },
        {
            Id: "900003",
            Name: "Benito",
            Surname: "Angelo",
            City: "Appiano Strada Vino",
            OfficialEmail: "s900003@students.politu.it",
            Birthday: "1991-11-06",
            SSN: "FH21915512",
        },
        {
            Id: "900004",
            Name: "Algiso",
            Surname: "Arcuri",
            City: "Ambrogio",
            OfficialEmail: "s900004@students.politu.it",
            Birthday: "1991-11-09",
            SSN: "KU71485501",
        },
        {
            Id: "900005",
            Name: "Costantino",
            Surname: "Genovese",
            City: "Zollino",
            OfficialEmail: "s900005@students.politu.it",
            Birthday: "1991-11-09",
            SSN: "DZ27229300",
        },
        {
            Id: "900006",
            Name: "Medardo",
            Surname: "Bianchi",
            City: "San Nicolo' A Tordino",
            OfficialEmail: "s900006@students.politu.it",
            Birthday: "1991-11-10",
            SSN: "FO42789345",
        },
        {
            Id: "900007",
            Name: "Felice",
            Surname: "Cocci",
            City: "Colle",
            OfficialEmail: "s900007@students.politu.it",
            Birthday: "1991-11-11",
            SSN: "DC3938219",
        },
        {
            Id: "900008",
            Name: "Gastone",
            Surname: "Buccho",
            City: "Monte Antico",
            OfficialEmail: "s900008@students.politu.it",
            Birthday: "1991-11-12",
            SSN: "PN69370639",
        },
        {
            Id: "900009",
            Name: "Olga",
            Surname: "Beneventi",
            City: "Palmori",
            OfficialEmail: "s900009@students.politu.it",
            Birthday: "1991-11-13",
            SSN: "NT60462698",
        },
    ];
    const tchEntities = [
        {
            Number: "d9000",
            GivenName: "Ines",
            Surname: "Beneventi",
            OfficialEmail: "Ines.Beneventi@politu.it",
            SSN: "XT6141393",
        },
        {
            Number: "d9001",
            GivenName: "Nino",
            Surname: "Lucciano",
            OfficialEmail: "Nino.Lucciano@politu.it",
            SSN: "BC32576022",
        },
        {
            Number: "d9002",
            GivenName: "Agostina",
            Surname: "Costa",
            OfficialEmail: "Agostina.Costa@politu.it",
            SSN: "OV16025746",
        },
        {
            Number: "d9003",
            GivenName: "Catena",
            Surname: "Piazza",
            OfficialEmail: "Catena.Piazza@politu.it",
            SSN: "RU88386453",
        },
        {
            Number: "d9004",
            GivenName: "Marisa",
            Surname: "Fiorentini",
            OfficialEmail: "Marisa.Fiorentini@politu.it",
            SSN: "SK31148026",
        },
        {
            Number: "d9005",
            GivenName: "Ester",
            Surname: "Genovesi",
            OfficialEmail: "Ester.Genovesi@politu.it",
            SSN: "OH66365489",
        },
        {
            Number: "d9006",
            GivenName: "Marina",
            Surname: "Castiglione",
            OfficialEmail: "Marina.Castiglione@politu.it",
            SSN: "YE28316232",
        },
        { Number: "d9007", GivenName: "Pupa", Surname: "Sal", OfficialEmail: "Pupa.Sal@politu.it", SSN: "ZZ96310067" },
        {
            Number: "d9008",
            GivenName: "Landro",
            Surname: "Toscano",
            OfficialEmail: "Landro.Toscano@politu.it",
            SSN: "PR25217515",
        },
        {
            Number: "d9009",
            GivenName: "Blanda",
            Surname: "Lombardo",
            OfficialEmail: "Blanda.Lombardo@politu.it",
            SSN: "QF55328037",
        },
        {
            Number: "d9010",
            GivenName: "Marisa",
            Surname: "Greece",
            OfficialEmail: "Marisa.Greece@politu.it",
            SSN: "FH15147632",
        },
    ];
    const crsEntities = [
        { Code: "XY1211", Year: 1, Semester: 1, Course: "Metodi di finanziamento delle imprese", Teacher: "d9000" },
        { Code: "XY4911", Year: 1, Semester: 1, Course: "Chimica", Teacher: "d9001" },
        { Code: "XY8612", Year: 1, Semester: 2, Course: "Informatica", Teacher: "d9002" },
        { Code: "XY2312", Year: 1, Semester: 2, Course: "Fisica I", Teacher: "d9003" },
        { Code: "XY6012", Year: 1, Semester: 2, Course: "Algebra lineare e geometria", Teacher: "d9004" },
        { Code: "XY9712", Year: 1, Semester: 2, Course: "Economia e organizzazione aziendale", Teacher: "d9005" },
        { Code: "XY3412", Year: 1, Semester: 2, Course: "Economia e organizzazione aziendale", Teacher: "d9006" },
        { Code: "XY7121", Year: 2, Semester: 1, Course: "Analisi matematica II", Teacher: "d9007" },
        { Code: "XY0821", Year: 2, Semester: 1, Course: "Analisi matematica II", Teacher: "d9008" },
        { Code: "XY4521", Year: 2, Semester: 1, Course: "Basi di dati", Teacher: "d9009" },
        { Code: "XY8221", Year: 2, Semester: 1, Course: "Basi di dati", Teacher: "d9010" },
    ];
    const elmEntities = [
        { Code: "XY1211", Student: "900000" },
        { Code: "XY1211", Student: "900001" },
        { Code: "XY4911", Student: "900001" },
        { Code: "XY2312", Student: "900002" },
        { Code: "XY7121", Student: "900008" },
        { Code: "XY0821", Student: "900008" },
        { Code: "XY4521", Student: "900009" },
    ];

    //const sdlEntities = [
    //    { Code: "XY1211", Room: 1, Day: "Mon", Seats: 120, Time: "8:30-11:30" },
    //    { Code: "XY4911", Room: 1, Day: "Mon", Seats: 120, Time: "11:30-13:00" },
    //    { Code: "XY1211", Room: 2, Day: "Tue", Seats: 120, Time: "16:00-17:30" },
    //    { Code: "XY4911", Room: 2, Day: "Tue", Seats: 120, Time: "13:00-16:00" },
    //    { Code: "XY7121", Room: 3, Day: "Mon", Seats: 80, Time: "10:00-11:30" },
    //    { Code: "XY0821", Room: 4, Day: "Mon", Seats: 80, Time: "8:30-10:00" },
    //    { Code: "XY4521", Room: 3, Day: "Mon", Seats: 80, Time: "8:30-11:30" },
    //    { Code: "XY8221", Room: 4, Day: "Mon", Seats: 80, Time: "10:00-11:30" },
    //    { Code: "XY1921", Room: 3, Day: "Mon", Seats: 80, Time: "13:00-14:30" },
    //];

    describe("SupportOfficerService", function () {
        before(async function openDb() {
            await Dao.init("testing.db");
        });

        after(async function clean() {
            await prepare("testing.db", "testing.sql", false);
            //Dao.closeConn();
        });

        function validator(err, errno, message, statusCode) {
            const payload = err.payload;
            assert.equal(payload.errno, errno);
            assert(payload.message.includes(message));
            assert.equal(payload.statusCode, statusCode);
            assert.equal(payload.statusCode, err.statusCode);

            return true;
        }

        describe("manageEntitiesUpload", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSupportOfficerService.sql", false);
            });

            it("Should have rejected the request", async function () {
                const errno = 6;
                const message = "not valid";
                const code = 400;
                await assert.rejects(Service.manageEntitiesUpload(stdEntities, "/api/foo"), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have successfully added the students", async function () {
                const ret = await Service.manageEntitiesUpload(stdEntities, "/api/students");
                assert.equal(ret, 204);
            });

            it("Should have successfully added the courses", async function () {
                await Service.manageEntitiesUpload(tchEntities, "/api/teachers");
                const retCode = await Service.manageEntitiesUpload(crsEntities, "/api/courses");
                assert.equal(retCode, 204);
            });

            it("Should have successfully added the enrollments", async function () {
                const ret1 = await Service.manageEntitiesUpload(tchEntities, "/api/teachers");
                assert.equal(ret1, 204);
                const ret2 = await Service.manageEntitiesUpload(crsEntities, "/api/courses");
                assert.equal(ret2, 204);
                const ret3 = await Service.manageEntitiesUpload(stdEntities, "/api/students");
                assert.equal(ret3, 204);
                const retCode = await Service.manageEntitiesUpload(elmEntities, "/api/enrollments");
                assert.equal(retCode, 204);
            });

            //    it("Should have successfully added the schedules", async function () {
            //        const ret = await Service.manageEntitiesUpload(sdlEntities, "/api/schedules");
            //        assert.equal(ret, 200);
            //    });
        });

        describe("getCourses", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSupportOfficerService.sql", false);
            });

            it("Should have raised an error", async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.getCourses("foo"), (err) => validator(err, errno, message, code));
            });

            it("Should have returned an array", async function () {
                const supportId = 1;
                const res = await Service.getCourses(supportId);
                assert(res.constructor === Array);
            });

            it("Should have returned 4 elements", async function () {
                const supportId = 1;
                const res = await Service.getCourses(supportId);
                assert.equal(res.length, 4);
            });
        });

        describe("getCourseLectures", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSupportOfficerService.sql", false);
            });

            const supportId = 1;
            const courseId = 1;

            it("Should have raised an error", async function () {
                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.getCourseLectures(supportId, "foo"), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have returned an array", async function () {
                const res = await Service.getCourseLectures(supportId, courseId);
                assert.equal(res.constructor, Array);
            });

            it("Should have returned 3 elements", async function () {
                const res = await Service.getCourseLectures(supportId, courseId);
                assert.equal(res.length, 3);
            });

            it("Should have returned 0 elements", async function () {
                const courseIdEmp = 4;
                const res = await Service.getCourseLectures(supportId, courseIdEmp);
                assert.equal(res.length, 0);
            });
        });

        describe("updateCourseLecture", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSupportOfficerService.sql", false);
            });

            const supportId = 1;

            it("Should have raised an error with wrong courseId as input", async function () {
                const courseId = "1a";
                const lectureId = 1;
                const switchTo = "remote";

                const errno = 3;
                const message = "not an integer";
                const code = 400;
                await assert.rejects(Service.updateCourseLecture(supportId, courseId, lectureId, switchTo), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have raised an error with wrong switchTo as input", async function () {
                const courseId = 1;
                const lectureId = 1;
                const switchTo = "foo";

                const errno = 22;
                const message = "not valid";
                const code = 400;
                await assert.rejects(Service.updateCourseLecture(supportId, courseId, lectureId, switchTo), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have raised an error with wrong course/lecture correlation", async function () {
                const courseId = 1;
                const lectureId = 5;
                const switchTo = "remote";

                const errno = 11;
                const message = "not belong";
                const code = 404;
                await assert.rejects(Service.updateCourseLecture(supportId, courseId, lectureId, switchTo), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should not be switchable", async function () {
                const courseId = 1;
                const lectureId = 1;
                const switchTo = "remote";

                const errno = 24;
                const message = "not switchable";
                const code = 409;
                await assert.rejects(Service.updateCourseLecture(supportId, courseId, lectureId, switchTo), (err) =>
                    validator(err, errno, message, code)
                );
            });

            it("Should have switched", async function () {
                const courseId = 1;
                const lectureId = 2;
                const switchTo = "remote";

                const res = await Service.updateCourseLecture(supportId, courseId, lectureId, switchTo);
                assert.equal(res, 204);
            });
        });

        describe("supportOfficerGetSchedules", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testing.sql", false);
            });

            it("should return the list of schedules", function (done) {
                Service.supportOfficerGetSchedules({ managerId: 1 })
                    .then((schedules) => {
                        assert.strictEqual(schedules.length, 5, "Wrong number of schedules retrieved");
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe("supportOfficerUpdateSchedule", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSchedule.sql", false);
            });

            it("existing schedule with correct new params should update the schedule", function (done) {
                const schedule1 = new Schedule(1, "1", 2020, 1, "1A", 10, "Mon", "8:30", "10:00");
                const updatedSchedule = schedule1;
                const class2 = new Class(2, "2B", 10);
                updatedSchedule.roomId = class2.classDescription;

                Service.supportOfficerUpdateSchedule({
                    managerId: 1,
                    scheduleId: updatedSchedule.scheduleId
                }, updatedSchedule)
                    .then((nLectures) => {
                        assert.ok(nLectures > 0, "No lecture updated"); // the exact number of lectures depends on the date you run tests
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it("wrong schedule should reject the request", function (done) {
                const wrongSchedule = new Schedule(
                    -1,
                    -1,
                    1970,
                    -1,
                    "Wrong roomId",
                    -1,
                    "Wrong day",
                    "Not a time",
                    "Not a time"
                );

                Service.supportOfficerUpdateSchedule({
                    managerId: 1,
                    scheduleId: wrongSchedule.scheduleId
                }, wrongSchedule)
                    .then((nLectures) => done("This must fail!"))
                    .catch((err) => done()); // correct case
            });

            it("correct schedule but overlapped with another one of the same course should reject the request", function (done) {
                const schedule1 = new Schedule(1, "1", 2020, 1, "1A", 10, "Mon", "8:30", "10:00");
                const overlappedScheduleSameCourse = Schedule.from(schedule1);
                const schedule2 = new Schedule(2, "2", 2020, 1, "2B", 10, "Mon", "8:30", "10:00");
                overlappedScheduleSameCourse.roomId = schedule2.roomId;

                Service.supportOfficerUpdateSchedule({
                    managerId: 1,
                    scheduleId: overlappedScheduleSameCourse.scheduleId,
                }, overlappedScheduleSameCourse)
                    .then((nLectures) => done("This must fail!"))
                    .catch((err) => done()); // correct case
            });

            it("correct schedule but overlapped with another one of a different course in the same class should reject the request", function (done) {
                const schedule1 = new Schedule(1, "1", 2020, 1, "1A", 10, "Mon", "8:30", "10:00");
                const overlappedScheduleDifferentCourse = Schedule.from(schedule1);
                const schedule2 = new Schedule(2, "2", 2020, 1, "2B", 10, "Mon", "8:30", "10:00");
                overlappedScheduleDifferentCourse.roomId = schedule2.roomId;
                overlappedScheduleDifferentCourse.startingTime = schedule2.startingTime;
                overlappedScheduleDifferentCourse.endingTime = schedule2.endingTime;

                Service.supportOfficerUpdateSchedule({
                    managerId: 1,
                    scheduleId: overlappedScheduleDifferentCourse.scheduleId,
                }, overlappedScheduleDifferentCourse)
                    .then((nLectures) => done("This must fail!"))
                    .catch((err) => done()); // correct case
            });
        });

        describe("supportOfficerGetRooms", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testing.sql", false);
            });

            it("should return the correct number of rooms", function (done) {
                Service.supportOfficerGetRooms({ managerId: 1 })
                    .then((rooms) => {
                        assert.strictEqual(rooms.length, 3, "Wrong number of rooms");
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
};

module.exports = testSuiteSupportOfficer;
