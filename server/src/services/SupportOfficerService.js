const { ResponseError } = require("../utils/ResponseError");
const { isValueOfType } = require("../utils/converter");
const db = require("../db/Dao");
const fs = require("fs");

const errno = ResponseError.errno;
const MODULE_NAME = "SupportOfficerService";
const ACCEPTED_ENTITIES = ["STUDENTS", "COURSES", "TEACHERS", "SCHEDULES", "ENROLLMENTS"];
const DB_TABLES = {
    STUDENTS: {
        name: "User",
        fields: ["type", "firstName", "lastName", "email", "ssn", "birthday", "city", "serialNumber"],
        jsonFields: ["type", "Name", "Surname", "OfficialEmail", "SSN", "Birthday", "City", "Id"],
    },
    TEACHERS: {
        name: "User",
        fields: ["type", "firstName", "lastName", "email", "ssn", "serialNumber"],
        jsonFields: ["type", "GivenName", "Surname", "OfficialEmail", "SSN", "Number"],
    },
    COURSES: {
        name: "Course",
        fields: ["description", "year", "code", "semester"],
        jsonFields: ["Course", "Year", "Code", "Semester"],
    },
    TEACHERCOURSE: {
        name: "TeacherCourse",
        fields: ["teacherId", "courseId", "isValid"],
        jsonFields: [
            { func: { name: getTeacherIdFromSerialNumber, args: ["Number"] } },
            { func: { name: getCourseIdFromCode, args: ["Code"] } },
            { func: { name: getIsValid, args: undefined } },
        ],
    },
    ENROLLMENTS: {
        name: "Enrollment",
        fields: ["studentId", "courseId", "year"],
        jsonFields: [
            { func: { name: getStudentIdFromSerialNumber, args: ["Student"] } },
            { func: { name: getCourseIdFromCode, args: ["Code"] } },
            { func: { name: getAAyear, args: undefined } },
        ],
    },
    SCHEDULES: {
        name: "Schedule",
        fields: ["code", "AAyear", "semester", "roomId", "seats", "dayOfWeek", "startingTime", "endingTime"],
        jsonFields: [
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

async function manageEntitiesUpload(entities, path) {
    const entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        throw genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: path});
    }

    const wellFormedEntitiesArray = await mapEntities(entityType, entities);

    if (wellFormedEntitiesArray.length > 0) {
        await Promise.all(
            wellFormedEntitiesArray.map(async (wellFormedEntities) => {
                const sqlQueries = genSqlQueries("INSERT", entityType, wellFormedEntities);
                await runBatchQueries(sqlQueries);
            })
        );
    }

    return 200;
}

/**
 * Transform the input entities in a suitable form
 */
async function mapEntities(entityType, entities) {
    switch (entityType) {
        case "STUDENTS": {
            return [mapUserEntities(entities, entityType)];
        }
        case "TEACHERS": {
            return [mapUserEntities(entities, entityType)];
        }
        case "COURSES": {
            const courseEntities = mapGenericEntities(entities, entityType);
            const sqlQueries = genSqlQueries("INSERT", entityType, courseEntities);
            await runBatchQueries(sqlQueries);

            const teacherCourseEntities = await mapTeacherCourseEntities(entities, "TEACHERCOURSE");
            const sqlQueries2 = genSqlQueries("INSERT", "TEACHERCOURSE", teacherCourseEntities);
            await runBatchQueries(sqlQueries2);
            return [];
        }
        case "ENROLLMENTS": {
            return [await mapEnrollmentEntities(entities, entityType)];
        }
        case "SCHEDULES": {
            return [mapGenericEntities(entities, entityType)];
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

function mapUserEntities(entities, entityType) {
    const { tableFields, jsonFields } = getTableAndJsonFields(entityType);

    return entities.map((e) => {
        e.type = entityType.slice(0, entityType.length - 1);

        return applyAction(e, jsonFields, tableFields);
    });
}

function getTableAndJsonFields(entityType) {
    const tableFields = DB_TABLES[entityType].fields;
    const jsonFields = DB_TABLES[entityType].jsonFields;

    return { tableFields, jsonFields };
}

function mapGenericEntities(entities, entityType) {
    const { tableFields, jsonFields } = getTableAndJsonFields(entityType);

    return entities.map((entity) => applyAction(entity, jsonFields, tableFields));
}

async function mapEnrollmentEntities(entities, entityType) {
    allStudentsWithSN = await db.getAllStudents();
    allCoursesWithCode = await db.getAllCourses();

    allStudentsWithSN = allStudentsWithSN.filter((student) => student.serialNumber !== null);
    allCoursesWithCode = allCoursesWithCode.filter((course) => course.code !== null);

    allStudentsWithSN.sort(userComparator);
    allCoursesWithCode.sort(courseComparator);

    const { tableFields, jsonFields } = getTableAndJsonFields(entityType);
    return entities.map((entity) => applyAction(entity, jsonFields, tableFields));
}

function applyAction(entity, fromFields, toFields) {
    const ret = {};

    for (let i = 0; i < fromFields.length; i++) {
        if (isValueOfType("string", fromFields[i])) {
            ret[toFields[i]] = entity[fromFields[i]];
        } else {
            const func = fromFields[i].func.name;
            let args = fromFields[i].func.args;

            if (args === undefined) {
                ret[toFields[i]] = func();
            } else {
                args = args.map((arg) => entity[arg]);
                ret[toFields[i]] = func(...args);
            }
        }
    }

    return ret;
}

async function mapTeacherCourseEntities(entities, entityType) {
    allTeachersWithSN = await db.getAllTeachers();
    allCoursesWithCode = await db.getAllCourses();

    allTeachersWithSN = allTeachersWithSN.filter((teacher) => teacher.serialNumber !== null);
    allCoursesWithCode = allCoursesWithCode.filter((course) => course.code !== null);

    allTeachersWithSN.sort(userComparator);
    allCoursesWithCode.sort(courseComparator);

    const { tableFields, jsonFields } = getTableAndJsonFields(entityType);

    return entities.map((entity) => {
        let a = {};
        a.Number = entity.Teacher;
        a.Code = entity.Code;
        return applyAction(a, jsonFields, tableFields);
    });
}

function logToFile(queries) {
    let date = new Date();

    fs.appendFile("./queries.log", `\n${date.toISOString()}\n`, function (err) {
        if (err) return console.log(err);
        console.log("Now > queries.log");
    });

    fs.appendFile("./queries.log", queries, function (err) {
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

function genSqlQueries(queryType, entityType, entities, maxQuery) {
    switch (queryType) {
        case "INSERT": {
            const queriesArray = genInsertSqlQueries(entityType, entities);

            let queriesString = queriesArray.join(";\n");
            queriesString = queriesString + ";";

            return queriesString;
        }
        default: {
            console.log(`${queryType} not implemented in genSqlQueries`);
            break;
        }
    }
}

function genInsertSqlQueries(entityType, entities) {
    const table = DB_TABLES[entityType];
    const queryTemplate = `INSERT INTO ${table.name}(${table.fields.join(", ")}) VALUES`;

    const queries = entities.map(
        (entity) =>
            queryTemplate +
            "(" +
            Object.values(entity)
                .map((field) => `"${field}"`)
                .join(", ") +
            ")"
    );

    return queries;
}

function genResponseError(nerror, error) {
    return new ResponseError(MODULE_NAME, nerror, error);
}

function getEntityNameFromPath(path) {
    const tokens = path.split("/");
    const possibleEntity = tokens[tokens.length - 1].toUpperCase();

    const ret = ACCEPTED_ENTITIES.find((entity) => entity === possibleEntity);

    return ret;
}
const privateFunc = { getEntityNameFromPath, genInsertSqlQueries };

module.exports = { manageEntitiesUpload };
