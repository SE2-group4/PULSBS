const { ResponseError } = require("../utils/ResponseError");
const Student = require("../entities/Student");
const db = require("../db/Dao");

const errno = ResponseError.errno;
const MODULE_NAME = "SupportOfficerService";
const ACCEPTED_ENTITIES = ["STUDENTS", "COURSES", "TEACHERS", "LECTURES", "CLASSES"];

const DB_TABLES_FIELDS = {
    STUDENTS: {
        name: "USER",
        fields: ["userId", "type", "firstName", "lastName", "email", "password"],
    },
    TEACHERS: {
        name: "USER",
        fields: ["userId", "type", "firstName", "lastName", "email", "password"],
    },
    COURSES: {
        name: "COURSE",
        fields: ["courseId", "description", "year"],
    },
    LECTURES: {
        name: "LECTURE",
        fields: ["lectureId", "courseId", "classId", "startingDate", "duration", "bookingDeadline", "delivery"],
    },
    CLASSES: {
        name: "CLASS",
        fields: ["classId", "description", "capacity"],
    },
};

async function manageEntitiesUpload(entities, path) {
    const entityType = getEntityNameFromPath(path);
    if (entityType === undefined) {
        return genResponseError(errno.ENTITY_TYPE_NOT_VALID, { type: entityType });
    }

    const students = [new Student(1, "ciao"), new Student(2)];
    genSqlQueries("INSERT", entityType, students);
}

function genSqlQueries(queryType, entityType, entities, maxQuery) {
    switch (queryType) {
        case "INSERT": {
            const queries = getInsertSqlQueries(entityType, entities);
            console.log("sono genSqlQueries", queries);
            break;
        }
        default: {
            console.log(`${queryType} not implemented in genSqlQueries`);
            break;
        }
    }
}

function getInsertSqlQueries(entityType, entities) {
    const table = DB_TABLES_FIELDS[entityType];
    let queryTemplate = `INSERT INTO ${table.name}(${table.fields.join(", ")}) VALUES`;

    const queries = entities.map((entity) => queryTemplate + "(" + Object.values(entity).join(", ") + ")");

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
