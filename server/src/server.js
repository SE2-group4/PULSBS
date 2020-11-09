"use strict";

const express = require("express");
const Student = require("./controllers/StudentController");
const Teacher = require("./controllers/TeacherController");
const General = require("./controllers/GeneralController");

const app = express();
const PORT = 3001;
const baseRoute = "/api/v1";

app.use(express.json());

// Student routes
app.get(
  `${baseRoute}/students/:studentId/courses/:courseId/lectures/:lectureId`,
  Student.studentBookLecture
);

app.get(
  `${baseRoute}/students/:studentId/courses/:courseId/lectures`,
  Student.studentGetCourseLectures
);

app.get(`${baseRoute}/students/:studentId/courses`, Student.studentGetCourses);

// Teacher routes
app.get(
  `${baseRoute}/teachers/:teacherId/courses/:coursesId/lectures/:lectureId/students`,
  Teacher.teacherGetCourseLectureStudents
);

app.get(
  `${baseRoute}/teachers/:teacherId/courses/:coursesId/lectures`,
  Teacher.teacherGetCourseLectures
);

app.get(`${baseRoute}/teachers/:teacherId/courses`, Teacher.teacherGetCourses);

// General handlers
app.get(`${baseRoute}/login`, General.userLogin);

console.log(`Server running on http://localhost:${baseRoute}:${PORT}`);
