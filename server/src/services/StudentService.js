"use strict";

const Lecture = require("../entities/Lecture");
const Course = require("../entities/Course");
const Student = require("../entities/Student");

const { ResponseError } = require("../utils/ResponseError");

const db = require("../db/Dao");

/**
 * book a particular lecture
 *
 * studentId Integer
 * courseId Integer
 * lectureId Integer
 * no response value expected for this operation
 **/
// TODO we should also update the openapi docs. Right now in case of 200, we return nothing => we should return a confirmation
exports.studentBookLecture = function (studentId, courseId, lectureId) {
  if (isNaN(studentId)) {
    return new ResponseError("StudentService", `'studentId' parameter is not a number: ${studentId}`, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("StudentService", `'courseId' parameter is not a number: ${courseId}`, 400);
  } else if (isNaN(lectureId)) {
    return new ResponseError("StudentService", `'lectureId' parameter is not a number: ${lectureId}`, 400);
  }

  // TODO: implement db call
  const sId = studentId;
  const cId = courseId;
  const lId = lectureId;
  
  return new Promise(function (resolve, reject) {
    resolve("Lecture Booked");
  });

};

/**
 * Get all active lectures, which have not yet been delivered, for a given course
 *
 * studentId Integer 
 * courseId Integer 
 * returns array of lectures. In case of error an ResponseError
 **/
// TODO: we should do a check of whether the student is enrolled in this course.
exports.studentGetCourseLectures = async function (studentId, courseId) {
  if (isNaN(studentId)) {
    return new ResponseError("StudentService", `'studentId' parameter is not a number: ${studentId}`, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("StudentService", `'courseId' parameter is not a number: ${courseId}`, 400);
  }

  // const sId = studentId;
  const cId = courseId;
  // I also put the other fields in as a reminder
  const course = new Course(cId, undefined, undefined);

  db.openConn();

  const courseLectures = await db.getLecturesByCourse(course);
  return courseLectures;
};

/**
 * Get all courses enrolled in this academic year by a given student
 *
 * studentId Integer
 * returns array of courses. In case of error an ResponseError
 **/
exports.studentGetCourses = async function (studentId) {
  if (isNaN(studentId)) {
    return new ResponseError("StudentService", `'studentId' parameter is not a number: ${studentId}`, 400);
  }

  const sId = studentId;
  // I also put the other fields in as a reminder
  const student = new Student(sId, undefined, undefined, undefined, undefined);

  db.openConn();

  const studentCourses = await db.getCoursesByStudent(student);
  return studentCourses;
};
