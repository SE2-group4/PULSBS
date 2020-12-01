/**
 * main server module
 * here you can find all routes
 */
"use strict";

const cookieParser = require("cookie-parser");
const db = require("./db/Dao");
const express = require("express");
const jwt = require("express-jwt");
const morgan = require("morgan");
const prepareDb = require("./db/preparedb");

const General = require("./controllers/GeneralController");
const Student = require("./controllers/StudentController");
const Teacher = require("./controllers/TeacherController");
const colors = require("colors");
const { StandardErr } = require("./utils/utils");

const app = express();
app.disable('x-powered-by'); // security: do not show outside the server technology which has been used

const BASE_ROUTE = "/api/v1";
const JWT_SECRET = "1234567890";
const PORT = 3001;

let dbPath = "./PULSBS.db";
let sqlPath = undefined;

app.use(express.json());
app.use(cookieParser());

morgan.token("host", function (req) {
    return "src: " + req.hostname;
});
app.use(morgan(":method".blue + " :url :host code: :status :res[content-length] - :response-time ms"));

////////////////////////////////////////////////////////////////////////////////

// GENERAL HANDLERS (NO LOGIN NEEDED)
app.use(`${BASE_ROUTE}`, General);

// app.use(jwt({ secret: JWT_SECRET, algorithms: ['RS256'] }));
// app.use(jwt({ secret: JWT_SECRET, algorithms: ['RS256'] }).unless({ path: [ '/login', '/logout' ] }));

app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json(StandardErr.new('Login middleware', StandardErr.errno.NOT_ALLOWED, 'login must be performed before this action', 401));
        return;
    }
    next();
});
/*
// The following routes needs authentication
app.use((req, res, next) => {
    console.log('check if the cookie exists...');
    // if (!req.cookies) res.status(401).json("login must be performed before this action");
    if(!req.cookies) {
        res.status(401).json(StandardErr.new('Login middleware', StandardErr.errno.NOT_ALLOWED, 'login must be performed before this action', 401));
        return;
    }
    console.log('check if the cookie exists... - done');
    console.log('veryfing the cookie...');
    jwt.verify(req.cookies.token, { key: JWT_SECRET }, function(error, decoded) {
        console.log('veryfing the cookie... - done');
        // if (error) res.status(401).json('invalid login token');
        if(error) {
            res.status(401).json(StandardErr.new('Login middleware', StandardErr.errno.UNEXPECTED_VALUE, 'invalid login token', 401));
            return;
        }

        next(); // else, proceed
    });
});
*/

////////////////////////////////////////////////////////////////////////////////

// STUDENT ROUTES
app.use(`${BASE_ROUTE}/students`, Student);

////////////////////////////////////////////////////////////////////////////////

// TEACHER ROUTES
app.get(
    `${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId/students`,
    Teacher.teacherGetCourseLectureStudents
);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId`, Teacher.teacherGetCourseLecture);
app.delete(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId`, Teacher.teacherDeleteCourseLecture);
app.put(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId`, Teacher.teacherPutCourseLecture);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures`, Teacher.teacherGetCourseLectures);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

// every other routes get handled by this handler
app.all(`${BASE_ROUTE}`, () => console.log("This route is not supported. Check the openapi doc"));

////////////////////////////////////////////////////////////////////////////////

app.get(`${BASE_ROUTE}/reset`, async (req, res) => {
    try {

        sqlPath = sqlPath === undefined ? "PULSBS.sql" : sqlPath;
        await prepareDb(dbPath, sqlPath, true);
        res.status(200).send("Success Reset");
    } catch (err) {
        res.status(400).send("Failed Reset");
    }
});

const printConf = () => {
    console.log(`Server running on http://localhost:${PORT}${BASE_ROUTE}\n`);
    console.log("System parameters:".green);
    console.log(`DB path: ${dbPath}`);
};

// description: for demo purposes we are sending the email right now instead of waiting 23:59; alternatively call Teacher.nextCheck() for setting the time correctly)
const autoRun = () => {
    setTimeout(() => Teacher.checkForExpiredLectures(), 0);
};

const systemConf = {
    "--test": false, // set db to testing.db
    "--no-autorun": false, // disable autorun
    "--api": false, // set sql to testApi.sql
};

// prevent adding new properties. The properties's values can still be changed.
Object.seal(systemConf);

// "Main"
(async () => {
    try {
        console.log("INITIALIZING the system");

        const options = process.argv.slice(2);
        for(const option of options) {
            systemConf[option.toLowerCase()] = true;
        }

        if(systemConf["--test"]) {
            dbPath = "testing.db";
        }
        if(!systemConf["--no-autorun"]) {
            autoRun();
        }
        if(systemConf["--api"]) {
            sqlPath = "testApi.sql"
        }

        await db.init(dbPath);

        app.listen(PORT, printConf);
    } catch (err) {
        console.log(err, "FAILED initializing the system".red);
        return process.exit(-1);
    }
})();
