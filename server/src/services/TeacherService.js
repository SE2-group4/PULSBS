"use strict";

const Lecture = require("../entities/Lecture");
const Course = require("../entities/Course");
const Teacher = require("../entities/Teacher");

const { ResponseError } = require("../utils/ResponseError");

const db = require("../db/Dao");

/**
 * Get all the students that have an active booking for a given lecture
 *
 * teacherId Integer 
 * courseId Integer 
 * lectureId Integer
 * returns array of Students + Booking. In case of error an ResponseError
 **/
exports.teacherGetCourseLectureStudents = async function (teacherId, courseId, lectureId) {
  if (isNaN(teacherId)) {
    return new ResponseError("TeacherService", `'teacherId' parameter is not a number: ${teacherId}`, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("TeacherService", `'courseId' parameter is not a number: ${courseId}`, 400);
  } else if (isNaN(lectureId)) {
    return new ResponseError("TeacherService", `'lectureId' parameter is not a number: ${lectureId}`, 400);
  }

  const lId = Number(lectureId);
  // I also put the other fields in as a reminder
  const lecture = new Lecture(lId, undefined, undefined, undefined);

  db.openConn();

  const lectureStudents = await db.getStudentsByLecture(lecture);
  return lectureStudents;
};

/**
 * Get all active lectures, which have not yet been delivered, for a course taught by a given professor
 *
 * teacherId Integer 
 * courseId Integer
 * returns array of lectures. In case of error an ResponseError
 **/
// TODO: we should do a check of whether the teacher is teaching this course.
exports.teacherGetCourseLectures = async function (teacherId, courseId) {
  if (isNaN(teacherId)) {
    return new ResponseError("TeacherService", `'teacherId' parameter is not a number: ${teacherId}`, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("TeacherService", `'courseId' parameter is not a number: ${courseId}`, 400);
  }

  const cId = parseInt(courseId);
  // I also put the other fields in as a reminder
  const course = new Course(cId, undefined, undefined);

  db.openConn();

  const courseLectures = await db.getLecturesByCourse(course);
  return courseLectures;
};

/**
 * Get all courses taught in this academic year by a given professor
 *
 * teacherId Integer
 * returns array of courses. In case of error an ResponseError
 **/
exports.teacherGetCourses = async function (teacherId) {
  if (isNaN(teacherId)) {
    return new ResponseError("TeacherService", `'teacherId' parameter is not a number: ${teacherId}`, 400);
  }

  const tId = parseInt(teacherId);
  // I also put the other fields in as a reminder
  const teacher = new Teacher(tId, undefined, undefined, undefined, undefined);

  db.openConn();

  const teacherCourses = await db.getCoursesByTeacher(teacher);
  return teacherCourses;
};
