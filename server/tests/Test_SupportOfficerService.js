/**
 * test suite for the SupportOfficerService module
 */
"use strict";

const assert = require("assert").strict;
const path = require("path");

const Dao = require("../src/db/Dao.js");
const Service = require("../src/services/SupportOfficerService.js");
const Teacher = require("../src/entities/Teacher.js");
const Student = require("../src/entities/Student.js");
const Lecture = require("../src/entities/Lecture.js");
const { ResponseError } = require("../src/utils/ResponseError.js");
const prepare = require("../src/db/preparedb.js");
const moment = require("moment");

const testSuiteTeacherService = () => {
    var stdTests = `[{"Id":"900000","Name":"Ambra","Surname":"Ferri","City":"Poggio Ferro","OfficialEmail":"s900000@students.politu.it","Birthday":"1991-11-04","SSN":"MK97060783"},{"Id":"900001","Name":"Gianfranco","Surname":"Trentini","City":"Fenestrelle","OfficialEmail":"s900001@students.politu.it","Birthday":"1991-11-05","SSN":"SP80523410"},{"Id":"900002","Name":"Maria Rosa","Surname":"Pugliesi","City":"Villapiccola","OfficialEmail":"s900002@students.politu.it","Birthday":"1991-11-05","SSN":"ZO70355767"},{"Id":"900003","Name":"Benito","Surname":"Angelo","City":"Appiano Strada Vino","OfficialEmail":"s900003@students.politu.it","Birthday":"1991-11-06","SSN":"FH21915512"},{"Id":"900004","Name":"Algiso","Surname":"Arcuri","City":"Ambrogio","OfficialEmail":"s900004@students.politu.it","Birthday":"1991-11-09","SSN":"KU71485501"},{"Id":"900005","Name":"Costantino","Surname":"Genovese","City":"Zollino","OfficialEmail":"s900005@students.politu.it","Birthday":"1991-11-09","SSN":"DZ27229300"},{"Id":"900006","Name":"Medardo","Surname":"Bianchi","City":"San Nicolo' A Tordino","OfficialEmail":"s900006@students.politu.it","Birthday":"1991-11-10","SSN":"FO42789345"},{"Id":"900007","Name":"Felice","Surname":"Cocci","City":"Colle","OfficialEmail":"s900007@students.politu.it","Birthday":"1991-11-11","SSN":"DC3938219"},{"Id":"900008","Name":"Gastone","Surname":"Buccho","City":"Monte Antico","OfficialEmail":"s900008@students.politu.it","Birthday":"1991-11-12","SSN":"PN69370639"},{"Id":"900009","Name":"Olga","Surname":"Beneventi","City":"Palmori","OfficialEmail":"s900009@students.politu.it","Birthday":"1991-11-13","SSN":"NT60462698"}]`;
    var tchTests = `[{"Number":"d9000","GivenName":"Ines","Surname":"Beneventi","OfficialEmail":"Ines.Beneventi@politu.it","SSN":"XT6141393"},{"Number":"d9001","GivenName":"Nino","Surname":"Lucciano","OfficialEmail":"Nino.Lucciano@politu.it","SSN":"BC32576022"},{"Number":"d9002","GivenName":"Agostina","Surname":"Costa","OfficialEmail":"Agostina.Costa@politu.it","SSN":"OV16025746"},{"Number":"d9003","GivenName":"Catena","Surname":"Piazza","OfficialEmail":"Catena.Piazza@politu.it","SSN":"RU88386453"},{"Number":"d9004","GivenName":"Marisa","Surname":"Fiorentini","OfficialEmail":"Marisa.Fiorentini@politu.it","SSN":"SK31148026"},{"Number":"d9005","GivenName":"Ester","Surname":"Genovesi","OfficialEmail":"Ester.Genovesi@politu.it","SSN":"OH66365489"},{"Number":"d9006","GivenName":"Marina","Surname":"Castiglione","OfficialEmail":"Marina.Castiglione@politu.it","SSN":"YE28316232"},{"Number":"d9007","GivenName":"Pupa","Surname":"Sal","OfficialEmail":"Pupa.Sal@politu.it","SSN":"ZZ96310067"},{"Number":"d9008","GivenName":"Landro","Surname":"Toscano","OfficialEmail":"Landro.Toscano@politu.it","SSN":"PR25217515"},{"Number":"d9009","GivenName":"Blanda","Surname":"Lombardo","OfficialEmail":"Blanda.Lombardo@politu.it","SSN":"QF55328037"},{"Number":"d9010","GivenName":"Marisa","Surname":"Greece","OfficialEmail":"Marisa.Greece@politu.it","SSN":"FH15147632"}]`;
    var crsTests = `[{"Code":"XY1211","Year":1,"Semester":1,"Course":"Metodi di finanziamento delle imprese","Teacher":"d9000"},{"Code":"XY4911","Year":1,"Semester":1,"Course":"Chimica","Teacher":"d9001"},{"Code":"XY8612","Year":1,"Semester":2,"Course":"Informatica","Teacher":"d9002"},{"Code":"XY2312","Year":1,"Semester":2,"Course":"Fisica I","Teacher":"d9003"},{"Code":"XY6012","Year":1,"Semester":2,"Course":"Algebra lineare e geometria","Teacher":"d9004"},{"Code":"XY9712","Year":1,"Semester":2,"Course":"Economia e organizzazione aziendale","Teacher":"d9005"},{"Code":"XY3412","Year":1,"Semester":2,"Course":"Economia e organizzazione aziendale","Teacher":"d9006"},{"Code":"XY7121","Year":2,"Semester":1,"Course":"Analisi matematica II","Teacher":"d9007"},{"Code":"XY0821","Year":2,"Semester":1,"Course":"Analisi matematica II","Teacher":"d9008"},{"Code":"XY4521","Year":2,"Semester":1,"Course":"Basi di dati","Teacher":"d9009"},{"Code":"XY8221","Year":2,"Semester":1,"Course":"Basi di dati","Teacher":"d9010"}]`;
    var elmTests = `[{"Code":"XY1211","Student":"900000"},{"Code":"XY1211","Student":"900001"},{"Code":"XY4911","Student":"900001"},{"Code":"XY2312","Student":"900002"},{"Code":"XY7121","Student":"900008"},{"Code":"XY0821","Student":"900008"},{"Code":"XY4521","Student":"900009"}]`;
    var sdlTests = `[{"Code":"XY1211","Room":1,"Day":"Mon","Seats":120,"Time":"8:30-11:30"},{"Code":"XY4911","Room":1,"Day":"Mon","Seats":120,"Time":"11:30-13:00"},{"Code":"XY1211","Room":2,"Day":"Tue","Seats":120,"Time":"16:00-17:30"},{"Code":"XY4911","Room":2,"Day":"Tue","Seats":120,"Time":"13:00-16:00"},{"Code":"XY7121","Room":3,"Day":"Mon","Seats":80,"Time":"10:00-11:30"},{"Code":"XY0821","Room":4,"Day":"Mon","Seats":80,"Time":"8:30-10:00"},{"Code":"XY4521","Room":3,"Day":"Mon","Seats":80,"Time":"8:30-11:30"},{"Code":"XY8221","Room":4,"Day":"Mon","Seats":80,"Time":"10:00-11:30"},{"Code":"XY1921","Room":3,"Day":"Mon","Seats":80,"Time":"13:00-14:30"}]`;
    var stdEntities = JSON.parse(stdTests);
    var tchEntities = JSON.parse(tchTests);
    var crsEntities = JSON.parse(crsTests);
    var elmEntities = JSON.parse(elmTests);
    var sdlEntities = JSON.parse(sdlTests);

    describe("TeacherService", function () {
        before(async function openDb() {
            Dao.init("testing.db");
        });

        after(async function openDb() {
            await prepare("testing.db", "testSupportOfficerService.sql", false);
        });

        describe("manageEntitiesUpload", function () {
            beforeEach(async function clearDb() {
                await prepare("testing.db", "testSupportOfficerService.sql", false);
            });

            it("Should have rejected the request", async function () {
                await assert.rejects(Service.manageEntitiesUpload(stdEntities, "/api/foo"));
            });

            it("Should have successfully added the students", async function () {
                const retCode = await Service.manageEntitiesUpload(stdEntities, "/api/students");
                assert.equal(retCode, 200);
            });

            it("Should have successfully added the courses", async function () {
                Service.manageEntitiesUpload(tchEntities, "/api/teachers");
                const retCode = await Service.manageEntitiesUpload(crsEntities, "/api/courses");
                assert.equal(retCode, 200);
            });

            it("Should have successfully added the enrollments", async function () {
                const ret1 = await Service.manageEntitiesUpload(tchEntities, "/api/teachers");
                if(ret1 !== 200) assert(false);
                const ret2 = await Service.manageEntitiesUpload(crsEntities, "/api/courses");
                if(ret2 !== 200) assert(false);
                const ret3 = await Service.manageEntitiesUpload(stdEntities, "/api/students");
                if(ret3 !== 200) assert(false);
                const retCode = await Service.manageEntitiesUpload(elmEntities, "/api/enrollments");
                assert.equal(retCode, 200);
            });

            it("Should have successfully added the schedules", async function() {
                const ret = await Service.manageEntitiesUpload(sdlEntities, "/api/schedules");
                assert.equal(ret, 200);
            });
        });
    });
};

module.exports = testSuiteTeacherService;
