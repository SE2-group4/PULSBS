const { ResponseError } = require("../utils/ResponseError");
const { isValueOfType } = require("../utils/converter");
const Student = require("../entities/Student");
const db = require("../db/Dao");
const fs = require("fs");

const errno = ResponseError.errno;
const MODULE_NAME = "SupportOfficerService";
const ACCEPTED_ENTITIES = ["STUDENTS", "COURSES", "TEACHERS", "SCHEDULES", "ENROLLMENTS"];
// domande
// avere id + userId
// o tenere un campo solo
//
// user
// userId, firstName, lastName, email, password, ssn
//
// student
// studentId + userId, firstName, lastName, email, password, ssn
// teacher
// teacherId + userId, firstName, lastName, email, password, MISSING ssn
//
const DB_TABLES = {
    STUDENTS: {
        name: "User",
        fields: ["type", "firstName", "lastName", "email", "ssn", "birthday", "city"],
        jsonFields: ["type", "Name", "Surname", "OfficialEmail", "SSN", "Birthday", "City"],
    },
    TEACHERS: {
        name: "User",
        fields: ["type", "firstName", "lastName", "email", "ssn"],
        jsonFields: ["type", "GivenName", "Surname", "OfficialEmail", "SSN"],
    },
    COURSES: {
        name: "Course",
        fields: ["description", "year", "code", "semester"],
        jsonFields: ["Course", "Year", "Code", "Semester"],
    },
    ENROLLMENTS: {
        name: "Enrollment",
        fields: ["studentId", "courseId"],
        jsonFields: ["Student", "Code"],
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

async function manageEntitiesUpload(entities, path) {
    const entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        return genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: entityType });
    }

    entities = mapEntities(entityType, entities);
    await genSqlQueries("INSERT", entityType, entities);
}

function mapUserEntities(entities, entityType) {
    return entities.map((e) => {
        e.type = entityType.slice(0, entityType.length - 1);

        const tableFields = DB_TABLES[entityType].fields;
        const jsonFields = DB_TABLES[entityType].jsonFields;
        return applyAction(e, jsonFields, tableFields);
    });
}

function mapGenericEntities(entities, entityType) {
    console.log(entities);
    console.log(entityType);
    return entities.map((e) => {
        const tableFields = DB_TABLES[entityType].fields;
        const jsonFields = DB_TABLES[entityType].jsonFields;
        return applyAction(e, jsonFields, tableFields);
    });
}

function applyAction(entity, fromFields, toFields) {
    const ret = {};

    for (let i = 0; i < fromFields.length; i++) {
        if (isValueOfType("string", toFields[i])) {
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

function log(queries) {
    let date = new Date();
    fs.writeFile("./queries.log", date.toString(), function (err) {
        if (err) return console.log(err);
        console.log("Date > queries.log");
    });
    fs.writeFile("./queries.log", queries, function (err) {
        if (err) return console.log(err);
        console.log("queries > queries.log");
    });
}

function mapEntities(entityType, entities) {
    switch (entityType) {
        case "STUDENTS": {
            return mapUserEntities(entities, entityType);
        }
        case "TEACHERS": {
            return mapUserEntities(entities, entityType);
        }
        case "COURSES": {
            return mapGenericEntities(entities, entityType);
        }
        case "ENROLLMENTS": {
            return "";
        }
        case "SCHEDULES": {
            return mapGenericEntities(entities, entityType);
        }
    }
}

async function genSqlQueries(queryType, entityType, entities, maxQuery) {
    switch (queryType) {
        case "INSERT": {
            const queriesArray = genInsertSqlQueries(entityType, entities);
            const queriesString = queriesArray.join(";\n");
            log(queriesString);
            //await db.execBatch(queriesString);
            break;
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

function genResponseError(errno, error) {
    return new ResponseError(MODULE_NAME, errno, error);
}

function getEntityNameFromPath(path) {
    const tokens = path.split("/");
    const possibleEntity = tokens[tokens.length - 1].toUpperCase();

    const ret = ACCEPTED_ENTITIES.find((entity) => entity === possibleEntity);

    return ret;
}

module.exports = { manageEntitiesUpload };
