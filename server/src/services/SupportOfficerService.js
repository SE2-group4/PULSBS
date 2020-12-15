const { ResponseError } = require("../utils/ResponseError");
const Student = require("../entities/Student");
const db = require("../db/Dao");

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
        jsonFields: ["Student", "Code"]
    },
    SCHEDULES: {
        name: "Schedule",
        fields: ["code", "room", "dayOfWeek", "seats", "startingTime"],
        jsonFields: ["Code", "Room", "Day", "Seats", "Time"],
    },
};

async function manageEntitiesUpload(entities, path) {
    const entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        return genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: entityType });
    }

    entities = entities.map((e) => {
        const s = {};
        if (entityType === "STUDENTS" || entityType === "TEACHERS") {
            e.type = entityType.slice(0, entityType.length - 1);
        }

        for (const name of DB_TABLES[entityType].jsonFields) {
            s[name] = e[name];
        }
        return s;
    });

    await genSqlQueries("INSERT", entityType, entities);
}

function mapObjsToEntities(entityType, entities) {}

async function genSqlQueries(queryType, entityType, entities, maxQuery) {
    switch (queryType) {
        case "INSERT": {
            const queriesArray = genInsertSqlQueries(entityType, entities);
            const queriesString = queriesArray.join("; ");
            console.log(queriesString);
            await db.execBatch(queriesString);
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
    let queryTemplate = `INSERT INTO ${table.name}(${table.fields.join(", ")}) VALUES`;

    const queries = entities.map(
        (entity) =>
            queryTemplate +
            "(" +
            Object.values(entity)
                .map((a) => `"${a}"`)
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
    console.log(possibleEntity);
    const ret = ACCEPTED_ENTITIES.find((entity) => entity === possibleEntity);
    console.log("SONO RET", ret);
    return ret;
}

module.exports = { manageEntitiesUpload };
