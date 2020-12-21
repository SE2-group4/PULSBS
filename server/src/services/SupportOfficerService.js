const { ResponseError } = require("../utils/ResponseError");
const { isValueOfType } = require("../utils/converter");
const db = require("../db/Dao");
const fs = require("fs");

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
            { func: { name: getTeacherIdFromSerialNumber, args: ["Number"] } },
            { func: { name: getCourseIdFromCode, args: ["Code"] } },
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

const binarySearch = (array, target, propertyName) => {
    let startIndex = 0;
    let endIndex = array.length - 1;

    while (startIndex <= endIndex) {
        let middleIndex = Math.floor((startIndex + endIndex) / 2);

        if (target === array[middleIndex][propertyName]) {
            return middleIndex;
        }

        if (target > array[middleIndex][propertyName]) {
            startIndex = middleIndex + 1;
        } else if (target < array[middleIndex][propertyName]) {
            endIndex = middleIndex - 1;
        }
    }

    return -1;
};

/**
 * save the entities in the db
 * @param {Array} of Objects. See ACCEPTED_ENTITIES for a list of accepted entities.
 * @param {String} relative path. Es. /1/uploads/students
 * @returns {Integer} 200 in case of success. Otherwise it will throw a ResponseError
 */
async function manageEntitiesUpload(entities, path) {
    let entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        throw genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: path });
    }

    let done = false;

    while(!done) {
        console.log(entityType);
        console.time("mapping");
        const sanitizedEntities = await sanitizeEntities(entities, entityType);
        console.timeEnd("mapping");

        console.time("query");
        const sqlQueries = genSqlQueries("INSERT", entityType, sanitizedEntities);
        console.timeEnd("query");

        console.log(sqlQueries);
        console.time("run");
        await runBatchQueries(sqlQueries);
        console.timeEnd("run");

        if(!needAdditionalSteps(entityType)) {
            done = true;
        } else {
            entityType = "TEACHERCOURSE";
        }
    }

    return 200;
}

function needAdditionalSteps(step) {
    if(step === "COURSES") {
        return "TEACHERCOURSE";
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
            console.log("OK");
            return await sanitizeTeacherCourseEntities(entities, entityType);
        }
    }
}

function userComparator(a, b) {
    if (a.serialNumber < b.serialNumber) {
        return -1;
    }

    if (a.serialNumber > b.serialNumber) {
        return 1;
    }
    return 0;
}

function courseComparator(a, b) {
    if (a.code < b.code) {
        return -1;
    }
    if (a.code > b.code) {
        return 1;
    }
    return 0;
}

/**
 * Search in the array, an entity that has the target value in the propertyName
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

function getStartingTime(orario) {
    const tokens = orario.split("-");
    return tokens[0];
}

function getEndingTime(orario) {
    const tokens = orario.split("-");
    return tokens[1];
}

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

function sanitizeGenericEntities(entities, entityType) {
    const { mapFrom, mapTo } = getFieldsMapping(entityType);

    return entities.map((entity) => applyAction(entity, mapFrom, mapTo));
}

async function updateAndSort(who, comparator) {
    switch(who) {
        case "STUDENT": {
            allStudentsWithSN = await db.getAllStudents();
            allStudentsWithSN = allStudentsWithSN.filter((student) => student.serialNumber !== null);
            allStudentsWithSN.sort(comparator);
            break;
        };
        case "TEACHER": {
            allTeachersWithSN = await db.getAllTeachers();
            allTeachersWithSN = allTeachersWithSN.filter((teacher) => teacher.serialNumber !== null);
            allTeachersWithSN.sort(comparator);
            break;
        };
        case "COURSE": {
            allCoursesWithCode = await db.getAllCourses();
            allCoursesWithCode = allCoursesWithCode.filter((course) => course.code !== null);
            allCoursesWithCode.sort(comparator);
            break;
        };
    }
}

async function sanitizeEnrollmentsEntities(enrollments, entityType) {
    await updateAndSort("STUDENT", userComparator);
    await updateAndSort("COURSE", courseComparator);

    const { mapFrom, mapTo} = getFieldsMapping(entityType);
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

async function sanitizeTeacherCourseEntities(entities, entityType) {
    await updateAndSort("TEACHER", userComparator);
    await updateAndSort("COURSE", courseComparator);

    const { mapFrom, mapTo} = getFieldsMapping(entityType);

    return entities.map((entity) => {
        let tc = {};
        tc.Number = entity.Teacher;
        tc.Code = entity.Code;
        return applyAction(tc, mapFrom, mapTo);
    });
}

function logToFile(queries) {
    let date = new Date();

    fs.appendFile("./queries.log", `\n${date.toISOString()}\n`, function (err) {
        if (err) return console.log(err);
        console.log("Now > queries.log");
    });

    fs.appendFile("./queries.log", queries.join("\n"), function (err) {
        if (err) return console.log(err);
        console.log("Queries log > queries.log");
    });
}

async function runBatchQueries(sqlQueries) {
    try {
        await db.execBatch(sqlQueries);
        logToFile(sqlQueries);
    } catch (err) {
        console.log(err);
        throw genResponseError(errno.DB_GENERIC_ERROR);
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

function genResponseError(nerror, error) {
    return new ResponseError(MODULE_NAME, nerror, error);
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

const privateFunc = { getEntityNameFromPath, genInsertSqlQueries };

module.exports = { manageEntitiesUpload };
