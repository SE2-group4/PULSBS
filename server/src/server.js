/**
 * main server module
 * here you can find all routes
 */
"use strict";

const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const db = require("./db/Dao");

const Student = require("./controllers/StudentController");
const Teacher = require("./controllers/TeacherController");
const General = require("./controllers/GeneralController");
//const EmailService = require('../src/services/EmailService');

const app = express();

const PORT = 3001;
const BASE_ROUTE = "/api/v1";
const jwtSecret = "1234567890";

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General handlers (no login needed)
app.use(`${BASE_ROUTE}`, General);

// require login for all the following routes
app.use(jwt({ secret: jwtSecret, getToken: req => req.cookies.token, algorithms: ['RS256'] }));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Student routes
app.use(`${BASE_ROUTE}/students`, Student);

/*
app.post(`${BASE_ROUTE}/students/:studentId/courses/:courseId/lectures/:lectureId`, Student.studentBookLecture);
app.get(`${BASE_ROUTE}/students/:studentId/courses/:courseId/lectures`, Student.studentGetCourseLectures);
app.get(`${BASE_ROUTE}/students/:studentId/courses`, Student.studentGetCourses);
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Teacher routes
app.get(
  `${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId/students`,
  Teacher.teacherGetCourseLectureStudents
);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures`, Teacher.teacherGetCourseLectures);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

// every other routes get handled by this handler
app.all(`${BASE_ROUTE}`, () => console.log("the route is not supported. Check the openapi doc"));

( async () => {
  await db.init();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}${BASE_ROUTE}`));
})()
