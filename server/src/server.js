"use strict";

const express = require("express");
const morgan = require("morgan");

const Student = require("./controllers/StudentController");
const Teacher = require("./controllers/TeacherController");
const General = require("./controllers/GeneralController");

const db = require("./db/Dao");

const app = express();

const PORT = 3001;
const BASE_ROUTE = "/api/v1";

app.use(express.json());

morgan.token("host", function (req) {
  return "src: " + req.hostname;
});
app.use(morgan(":method :url :host code: :status :res[content-length] - :response-time ms"));

// Student routes
app.post(`${BASE_ROUTE}/students/:studentId/courses/:courseId/lectures/:lectureId`, Student.studentBookLecture);

app.get(`${BASE_ROUTE}/students/:studentId/courses/:courseId/lectures`, Student.studentGetCourseLectures);

app.get(`${BASE_ROUTE}/students/:studentId/courses`, Student.studentGetCourses);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Teacher routes
app.get(
  `${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures/:lectureId/students`,
  Teacher.teacherGetCourseLectureStudents
);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses/:courseId/lectures`, Teacher.teacherGetCourseLectures);

app.get(`${BASE_ROUTE}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General handlers
app.post(`${BASE_ROUTE}/login`, General.userLogin);

// every other routes get handled by this handler
app.all(`${BASE_ROUTE}`, () => console.log("the route is not supported. Check the openapi doc"));

( async () => {
  await db.init();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}${BASE_ROUTE}`));
})()
