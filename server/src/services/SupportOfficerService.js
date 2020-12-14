const { ResponseError } = require("../utils/ResponseError");
const Student = require("../entities/Student");
const db = require("../db/Dao");

const errno = ResponseError.errno;
const MODULE_NAME = "SupportOfficerService";
const ACCEPTED_ENTITIES = ["STUDENTS", "COURSES", "TEACHERS", "LECTURES", "CLASSES"];
// user
// userId, firstName, lastName, email, password, ssn
// student
// studentId + userId, firstName, lastName, email, password, ssn
// teacher
// teacherId + userId, firstName, lastName, email, password, MISSING ssn
//
// id, name, surname, city, officialEmail, Birthday, SSN
const DB_TABLES = {
    STUDENTS: {
        name: "User",
        //fields: ["userId", "type", "firstName", "lastName", "email", "password", "ssn"],
        fields: ["firstName", "lastName", "email", "password"],
        aaa: ["Name", "Surname", "OfficialEmail", "password"],
    },
    TEACHERS: {
        name: "User",
        //fields: ["userId", "type", "firstName", "lastName", "email", "password", "ssn"],
        fields: ["userId", "firstName", "lastName", "email", "password", "ssn"],
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

    entities = entities.map((e) => {
        const s = {};
        for (const name of DB_TABLES[entityType].aaa) {
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
            const queries = genInsertSqlQueries(entityType, entities);
            const str = queries.join("; ");
            console.log(str);
            const aaa = `INSERT INTO USER(firstName, lastName, email, password) VALUES("Ambra", "Ferri", "s900000@students.politu.it", "undefined");`
            await db.execBatch(aaa);
            console.log("DONE");
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
    const ret = ACCEPTED_ENTITIES.find((entity) => entity === possibleEntity);
    return ret;
}

module.exports = { manageEntitiesUpload };
