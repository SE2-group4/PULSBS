"use strict";

const express = require("express");
const morgan = require("morgan");

const Student = require("./controllers/StudentController");
const Teacher = require("./controllers/TeacherController");

const General = require("./controllers/GeneralController");

const app = express();
const PORT = 3001;
const baseRoute = "/api/v1";

app.use(express.json());

morgan.token("host", function (req, res) {
  return "src: " + req.hostname;
});
app.use(morgan(":method :url :host code: :status :res[content-length] - :response-time ms"));

// Student routes
app.post(`${baseRoute}/students/:studentId/courses/:courseId/lectures/:lectureId`, Student.studentBookLecture);

app.get(`${baseRoute}/students/:studentId/courses/:courseId/lectures`, Student.studentGetCourseLectures);

app.get(`${baseRoute}/students/:studentId/courses`, Student.studentGetCourses);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Teacher routes
app.get(
  `${baseRoute}/teachers/:teacherId/courses/:courseId/lectures/:lectureId/students`,
  Teacher.teacherGetCourseLectureStudents
);

app.get(`${baseRoute}/teachers/:teacherId/courses/:courseId/lectures`, Teacher.teacherGetCourseLectures);

app.get(`${baseRoute}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General handlers
app.post(`${baseRoute}/login`, General.userLogin);

// every other routes get handled by this handler
app.all(`${baseRoute}`, () => console.log("the route is not supported. Check the openapi doc"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}${baseRoute}`));
