const { ResponseError } = require("../utils/ResponseError");
const { isValueOfType } = require("../utils/converter");
const { binarySearch } = require("../utils/searchHelper");
const { convertToNumbers } = require("../utils/converter");
const Course = require("../entities/Course");
const Student = require("../entities/Student");
const Teacher = require("../entities/Teacher");
const Lecture = require("../entities/Lecture");
const Email = require("../entities/Email");
const EmailService = require("../services/EmailService");
const Schedule = require("../entities/Schedule");
const db = require("../db/Dao");
const utils = require("../utils/utils");
const fs = require("fs");
const check = require("../utils/typeChecker");

const errno = ResponseError.errno;
const MODULE_NAME = "SupportOfficerService";
const ACCEPTED_ENTITIES = ["STUDENTS", "COURSES", "TEACHERS", "SCHEDULES", "ENROLLMENTS", "TEACHERCOURSE"];
const DB_TABLES = {
    STUDENTS: {
        name: "User",
        mapTo: ["type", "firstName", "lastName", "email", "ssn", "birthday", "city", "serialNumber", "password"],
        mapFrom: [
            "type",
            "Name",
            "Surname",
            "OfficialEmail",
            "SSN",
            "Birthday",
            "City",
            "Id",
            { func: { name: getDefaultPassword, args: undefined } },
        ],
    },
    TEACHERS: {
        name: "User",
        mapTo: ["type", "firstName", "lastName", "email", "ssn", "serialNumber", "password"],
        mapFrom: [
            "type",
            "GivenName",
            "Surname",
            "OfficialEmail",
            "SSN",
            "Number",
            { func: { name: getDefaultPassword, args: undefined } },
        ],
    },
    COURSES: {
        name: "Course",
        mapTo: ["description", "year", "code", "semester"],
        mapFrom: ["Course", "Year", "Code", "Semester"],
    },
    TEACHERCOURSE: {
        name: "TeacherCourse",
        mapTo: ["teacherId", "courseId", "isValid"],
        mapFrom: [
            { func: { name: getTeacherIdFromSerialNumber, args: ["teacherSSN"] } },
            { func: { name: getCourseIdFromCode, args: ["courseCode"] } },
            { func: { name: getIsValid, args: undefined } },
        ],
    },
    ENROLLMENTS: {
        name: "Enrollment",
        mapTo: ["studentId", "courseId", "year"],
        mapFrom: [
            { func: { name: getStudentIdFromSerialNumber, args: ["Student"] } },
            { func: { name: getCourseIdFromCode, args: ["Code"] } },
            { func: { name: getAAyear, args: undefined } },
        ],
    },
    SCHEDULES: {
        name: "Schedule",
        mapTo: ["code", "AAyear", "semester", "roomId", "seats", "dayOfWeek", "startingTime", "endingTime"],
        mapFrom: [
            "Code",
            { func: { name: getAAyear, args: undefined } },
            { func: { name: getSemester, args: undefined } },
            "Room",
            "Seats",
            "Day",
            { func: { name: getStartingTime, args: ["Time"] } },
            { func: { name: getEndingTime, args: ["Time"] } },
        ],
    },
};

// TODO: fix race conditions
let allStudentsWithSN = null;
let allTeachersWithSN = null;
let allCoursesWithCode = null;

async function getCourses(supportId) {
    const { error } = convertToNumbers({ supportId });
    if (error) {
        throw genResponseError(ResponseError.PARAM_NOT_INT, error);
    }

    return await db.getAllCourses();
}

async function getCourseLectures(supportId, courseId) {
    const { error, courseId: cId } = convertToNumbers({ supportId, courseId });
    if (error) {
        throw genResponseError(ResponseError.PARAM_NOT_INT, error);
    }

    const lectures = await db.getLecturesByCourse(new Course(courseId));

    return lectures;
}

/**
 * Update a lecture delivery mode given a lectureId, courseId, teacherId and a switchTo mode
 * TODO: not done this part The switch is valid only if the request is sent 30m before the scheduled starting time.
 *
 * supportId {Integer}
 * courseId {Integer}
 * lectureId {Integer}
 * switchTo {String}. "remote" or "presence"
 * returns {Integer} 204. In case of error an ResponseError
 **/
async function updateCourseLecture(supportId, courseId, lectureId, switchTo) {
    const { error, courseId: cId, lectureId: lId } = convertToNumbers({ supportId, courseId, lectureId });
    if (error) {
        throw genResponseError(ResponseError.PARAM_NOT_INT, error);
    }

    if (!check.isValidDeliveryMode(switchTo)) {
        throw genResponseError(ResponseError.LECTURE_INVALID_DELIVERY_MODE, { delivery: switchTo });
    }

    // TODO: check course lecture correlation

    const lecture = await db.getLectureById(new Lecture(lId));
    if (lecture.delivery === switchTo.toUpperCase()) return 204;
    lecture.delivery = switchTo;

    //if (!isLectureSwitchable(lecture, new Date(), switchTo)) {
    //    throw new ResponseError("TeacherService", ResponseError.LECTURE_NOT_SWITCHABLE, { lectureId }, 404);
    //}

    await db.updateLectureDeliveryMode(lecture);

    const studentsToBeNotified = await db.getStudentsByLecture(lecture);
    if (studentsToBeNotified.length > 0) {
        const course = await db.getCourseByLecture(lecture);
        const subjectArgs = [course.description];
        const messageArgs = [utils.formatDate(lecture.startingDate), lecture.delivery];

        const { subject, message } = EmailService.getDefaultEmail(
            Email.EmailType.LESSON_UPDATE_DELIVERY,
            subjectArgs,
            messageArgs
        );

        sendEmailsTo(studentsToBeNotified, subject, message);
    }

    return 204;
}

function sendEmailsTo(recepients = [], subject, message) {
    for (const recepient of recepients) {
        EmailService.sendCustomMail(recepient.email, subject, message)
            .then(() => {
                console.email(`recepient: ${recepient.email}; subject: ${subject}`);
            })
            .catch((err) => console.error(err));
    }
}

/**
 * save the entities in the db
 * @param {Array} of Objects. See ACCEPTED_ENTITIES for a list of accepted entities.
 * @param {String} relative path. Es. /1/uploads/students
 * @returns {Integer} 200 in case of success. Otherwise it will throw a ResponseError
 */

function writeToFile(path = "./input/schedules.json", array) {
    fs.writeFile(path, JSON.stringify(array), (err) => {
        if (err) console.log("an error occured");
    });
}

async function manageEntitiesUpload(entities, path) {
    let entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        throw genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: path });
    }

    console.time("phase: mapping");
    const sanitizedEntities = await sanitizeEntities(entities, entityType);
    console.timeEnd("phase: mapping");

    console.time("phase: query gen");
    const sqlQueries = genSqlQueries("INSERT", entityType, sanitizedEntities);
    console.timeEnd("phase: query gen");

    console.time("phase: query run");
    await runBatchQueries(sqlQueries);
    console.timeEnd("phase: query run");

    if (needAdditionalSteps(entityType)) {
        return await callNextStep(entityType, entities, sanitizedEntities);
    }

    return 204;
}

async function callNextStep(currStep, ...args) {
    switch (currStep) {
        case "COURSES": {
            return await manageEntitiesUpload(args[0], "/teachercourse");
        }
        case "SCHEDULES": {
            //const s = args[0].filter((sc) => sc.code === "XY8221");
            //console.log("sono schedules", s);
            //try {
            //    await db._generateLecturesBySchedule(s[0]);
            //} catch (err) {
            //    console.log("SOMETHING WENT WRONG");
            //    console.log(err);
            //}
            break;
        }
        default: {
            console.log("callNextStep", currStep, "not implemented");
        }
    }
}

function needAdditionalSteps(currStep) {
    if (currStep === "COURSES" || currStep === "SCHEDULES") {
        return true;
    }

    return false;
}

/**
 * Transform the input entities in a suitable form
 */
async function sanitizeEntities(entities, entityType) {
    switch (entityType) {
        case "STUDENTS": {
            return sanitizeUserEntities(entities, entityType);
        }
        case "TEACHERS": {
            return sanitizeUserEntities(entities, entityType);
        }
        case "COURSES": {
            return sanitizeGenericEntities(entities, entityType);
        }
        case "ENROLLMENTS": {
            return await sanitizeEnrollmentsEntities(entities, entityType);
        }
        case "SCHEDULES": {
            return sanitizeGenericEntities(entities, entityType);
        }
        case "TEACHERCOURSE": {
            return await sanitizeTeacherCourseEntities(entities, entityType);
        }
    }
}

/**
 * Search in the array an entity that has the target value in the propertyName
 */
function findEntity(array, target, propertyName) {
    const index = binarySearch(array, target, propertyName);
    if (index === -1) {
        throw genResponseError(errno.ENTITY_NOT_FOUND, { type: target });
    }

    return array[index];
}

function getTeacherIdFromSerialNumber(serialNumber) {
    const teacher = findEntity(allTeachersWithSN, serialNumber, "serialNumber");

    return teacher.teacherId;
}

function getStudentIdFromSerialNumber(serialNumber) {
    const student = findEntity(allStudentsWithSN, serialNumber, "serialNumber");

    return student.studentId;
}

function getCourseIdFromCode(code) {
    const course = findEntity(allCoursesWithCode, code, "code");

    return course.courseId;
}

function getIsValid() {
    return 1;
}

function getDefaultPassword() {
    return "foo";
}

function getAAyear() {
    return 2020;
}

function getSemester() {
    return 1;
}

/**
 * extract the starting time. Es. from 14:30-16:00 it will return 14:30
 * @param {String} orario. Es. 14:30-16:00
 * @returns {String} es. 14:00
 */
function getStartingTime(orario) {
    const regex = /[0-9]+/g;
    const match = orario.match(regex);
    return `${match[0]}:${match[1]}:00`;
}

/**
 * extract the ending time. Es. from 14:30-16:00 it will return 16:00
 * @param {String} orario. Es. 14:30-16:00
 * @returns {String} es. 16:00
 */
function getEndingTime(orario) {
    const regex = /[0-9]+/g;
    const match = orario.match(regex);
    return `${match[2]}:${match[3]}:00`;
}

/**
 * get the mapFrom and mapTo properties of DB_TABLES
 * @param {String} entityType. See ACCEPTED_ENTITIES.
 * @returns {Object} with 2 properties: mapFrom and mapTo
 */
function sanitizeUserEntities(users, entityType) {
    const { mapFrom, mapTo } = getFieldsMapping(entityType);

    return users.map((u) => {
        // add to a user the field type. In our case it would be either TEACHER or STUDENT
        // we slice to take out the ending s. See ACCEPTED_ENTITIES
        u.type = entityType.slice(0, entityType.length - 1);

        return applyAction(u, mapFrom, mapTo);
    });
}

/**
 * get the mapFrom and mapTo properties of DB_TABLES
 * @param {String} entityType. See ACCEPTED_ENTITIES.
 * @returns {Object} with 2 properties: mapFrom and mapTo
 */
function getFieldsMapping(entityType) {
    const mapFrom = DB_TABLES[entityType].mapFrom;
    const mapTo = DB_TABLES[entityType].mapTo;

    return { mapFrom, mapTo };
}

/**
 * Apply the actions defined in the mapFrom to each entity
 * @param {Array} entities.
 * @param {String} entityType. See ACCEPTED_ENTITIES.
 * @returns {Array} of sanitized entities
 */
function sanitizeGenericEntities(entities, entityType) {
    const { mapFrom, mapTo } = getFieldsMapping(entityType);

    return entities.map((entity) => applyAction(entity, mapFrom, mapTo));
}

/**
 * update a global array using the comparator
 * @param {String} who
 */
async function updateAndSort(who, comparator) {
    switch (who) {
        case "STUDENT": {
            allStudentsWithSN = await db.getAllStudents();
            allStudentsWithSN = allStudentsWithSN.filter((student) => student.serialNumber !== null);
            allStudentsWithSN.sort(comparator);
            break;
        }
        case "TEACHER": {
            allTeachersWithSN = await db.getAllTeachers();
            allTeachersWithSN = allTeachersWithSN.filter((teacher) => teacher.serialNumber !== null);
            allTeachersWithSN.sort(comparator);
            break;
        }
        case "COURSE": {
            allCoursesWithCode = await db.getAllCourses();
            allCoursesWithCode = allCoursesWithCode.filter((course) => course.code !== null);
            allCoursesWithCode.sort(comparator);
            break;
        }
    }
}

/**
 * Apply the actions defined in the mapFrom to each entity
 * @param {Array} entities.
 * @param {String} entityType. See ACCEPTED_ENTITIES.
 * @returns {Promise} array of sanitized entities
 */
async function sanitizeEnrollmentsEntities(enrollments, entityType) {
    await updateAndSort("STUDENT", Student.getComparator("serialNumber"));
    await updateAndSort("COURSE", Course.getComparator("code"));

    const { mapFrom, mapTo } = getFieldsMapping(entityType);
    return enrollments.map((entity) => applyAction(entity, mapFrom, mapTo));
}

function applyAction(entity, mapFrom, mapTo) {
    const ret = {};

    for (let i = 0; i < mapFrom.length; i++) {
        if (isValueOfType("string", mapFrom[i])) {
            ret[mapTo[i]] = entity[mapFrom[i]];
        } else {
            const func = mapFrom[i].func.name;
            let args = mapFrom[i].func.args;

            if (args === undefined) {
                ret[mapTo[i]] = func();
            } else {
                args = args.map((arg) => entity[arg]);
                ret[mapTo[i]] = func(...args);
            }
        }
    }

    return ret;
}

/**
 * get the mapFrom and mapTo properties of DB_TABLES
 * @param {String} entityType. See ACCEPTED_ENTITIES.
 * @returns {Object} with 2 properties: mapFrom and mapTo
 */
async function sanitizeTeacherCourseEntities(entities, entityType) {
    await updateAndSort("TEACHER", Teacher.getComparator("serialNumber"));
    await updateAndSort("COURSE", Course.getComparator("code"));

    const { mapFrom, mapTo } = getFieldsMapping(entityType);

    return entities.map((entity) => {
        let tc = {};
        tc.teacherSSN = entity.Teacher;
        tc.courseCode = entity.Code;
        return applyAction(tc, mapFrom, mapTo);
    });
}

function logToFile(queries) {
    let date = new Date();

    fs.appendFile("./queries.log", `\n${date.toISOString()}\n`, function (err) {
        if (err) return console.log(err);
        console.log("LOG: date > queries.log");
    });

    fs.appendFile("./queries.log", queries.join("\n"), function (err) {
        if (err) return console.log(err);
        console.log("LOG: queries > queries.log");
    });
}

async function runBatchQueries(sqlQueries) {
    try {
        await db.execBatch(sqlQueries);
        logToFile(sqlQueries);
    } catch (err) {
        console.log(err);
        throw genResponseError(errno.DB_GENERIC_ERROR, { msg: err.toString() });
    }
}

/**
 * transform a db row into a specific type of user
 * @param {Object} row
 * @returns {User|Teacher|Manager|Support} specific user
 */
function genSqlQueries(queryType, entityType, entities, maxQuery) {
    switch (queryType) {
        case "INSERT": {
            const queriesArray = genInsertSqlQueries(entityType, entities);
            return queriesArray;
        }
        case "DELETE":
        case "UPDATE":
        default: {
            console.log(`${queryType} not implemented in genSqlQueries`);
            break;
        }
    }
}

/**
 * create an array of "insert sql query" given an entityType and a set of entities
 * @param {String} see ACCEPTED_ENTITIES
 * @param {Array} of Object
 * @returns {Array} of string
 */
function genInsertSqlQueries(entityType, entities) {
    const table = DB_TABLES[entityType];
    const queryTemplate = `INSERT INTO ${table.name}(${table.mapTo.join(", ")}) VALUES`;

    const queries = entities.map(
        (entity) =>
            queryTemplate +
            "(" +
            Object.values(entity)
                .map((field) => `"${field}"`)
                .join(", ") +
            ");"
    );

    return queries;
}

/**
 * find the entity name from the path
 * @param {String} path. Es. /1/uploads/students
 * @returns {String | undefined}. Returns STUDENTS
 */
function getEntityNameFromPath(path) {
    const tokens = path.split("/");
    const possibleEntity = tokens[tokens.length - 1].toUpperCase();

    const ret = ACCEPTED_ENTITIES.find((entity) => entity === possibleEntity);

    return ret;
}

function genResponseError(nerror, error) {
    return new ResponseError(MODULE_NAME, nerror, error);
}

const privateFunc = { getEntityNameFromPath, genInsertSqlQueries, updateAndSort };

module.exports = { manageEntitiesUpload, privateFunc, getCourses, getCourseLectures, updateCourseLecture };
