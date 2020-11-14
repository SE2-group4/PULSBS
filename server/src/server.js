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
//const EmailService = require('../src/services/EmailService');

const app = express();

const BASE_ROUTE = "/api/v1";
const JWT_SECRET = "1234567890";
const PORT = 3001;

let dbPath = "./PULSBS.db";

app.use(express.json());
app.use(cookieParser());

/* 
 * Email service example 
EmailService.sendConfirmationBookingEmail("fakeStudent.se2866755766@gmail.com", "SE2", "13:00")
  .then(() => console.log("Email sent"))
  .catch((info) => console.log(info))
*/

morgan.token("host", function (req) {
  return "src: " + req.hostname;
});
app.use(morgan(":method :url :host code: :status :res[content-length] - :response-time ms"));

////////////////////////////////////////////////////////////////////////////////

// GENERAL HANDLERS (NO LOGIN NEEDED)
app.use(`${BASE_ROUTE}`, General);

// The following routes needs authentication
app.use((err, req, res, next) => {
  if (!req.cookies) res.status(401).json("login must be performed before this action");
  jwt.verify(req.cookies.token, { key: JWT_SECRET }, (err, decoded) => {
    if (err) res.status(401).json("invalid login token");
  });
});

////////////////////////////////////////////////////////////////////////////////

// STUDENT ROUTES
app.use(`${BASE_ROUTE}/students`, Student);

////////////////////////////////////////////////////////////////////////////////

// TEACHER ROUTES
app.get(
  `${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId/students`,
  Teacher.teacherGetCourseLectureStudents
);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures`, Teacher.teacherGetCourseLectures);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

// every other routes get handled by this handler
app.all(`${BASE_ROUTE}`, () => console.log("This route is not supported. Check the openapi doc"));

////////////////////////////////////////////////////////////////////////////////

app.get(`${BASE_ROUTE}/reset`, async (req, res) => {
  try {
    const path = "./testing.db";
    await prepareDb(path);
    res.status(200).send("Success Reset");
  } catch (err) {
    res.status(400).send("Failed Reset");
  }
});

function printConfig() {
  console.log(`Server running on http://localhost:${PORT}${BASE_ROUTE}\n`);
  console.log("System parameters:");
  console.log(`DB path: ${dbPath}`);
}

// "Main"
(async () => {
  try {
    console.log("INITIALIZING the system");
    if (process.argv[2] === "--test") {
      dbPath = "./testing.db";
    }
    await db.init(dbPath);
    app.listen(PORT, printConfig);
  } catch (err) {
    console.log(err, "FAILED initializing the system");
    return process.exit(-1);
  }
})();
