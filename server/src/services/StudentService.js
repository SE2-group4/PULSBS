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
exports.studentGetCourseLectures = async function (studentId, courseId) {
  if (isNaN(studentId)) {
    return new ResponseError("StudentService", `'studentId' parameter is not a number: ${studentId}`, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("StudentService", `'courseId' parameter is not a number: ${courseId}`, 400);
  }

  const sId = Number(studentId);
  const cId = Number(courseId);

  // checking whether the student is in enrolled in this course during this academic year
  let isEnrolledIn = await isStudentEnrolledCourse(sId, cId);

  if (!isEnrolledIn) {
    return new ResponseError("StudentService", ResponseError.COURSE_NOT_ENROLLED_AA, { studentId, courseId }, 400);
  }

  // checking whether the teacher is in charge of this course during this academic year
  let doesLectureBelong = await doesLectureBelongCourse(cId, lId);

  if (!doesLectureBelong) {
    return new ResponseError(
      "TeacherService",
      `lecture (lectureId = ${lectureId}) does not belong to this course (courseId = ${courseId}). ` +
        `Or the lecture has already been given`,
      400
    );
  }

  const course = new Course(cId, undefined, undefined); // I also put the other fields in as a reminder
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

  const student = new Student(sId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder
  const studentCourses = await db.getCoursesByStudent(student);

  return studentCourses;
};

/**
 * Check whether a student is in enrolled in a course during this academic year
 *
 * student Integer
 * courseId Integer
 * returns boolean
 **/
const isStudentEnrolledCourse = async (studentId, courseId) => {
  let isEnrolledIn = false;

  const studentCourses = await db.getCoursesByStudent(
    new Student(studentId, undefined, undefined, undefined, undefined)
  );

  if (studentCourses.length > 0) {
    isEnrolledIn = studentCourses.some((course) => course.courseId === courseId);
  }

  return isEnrolledIn;
};

/**
 * Check whether this lecture belongs to this course
 *
 * courseId Integer
 * lectureId Integer
 * returns boolean
 **/
const doesLectureBelongCourse = async (courseId, lectureId) => {
  let doesBelong = false;

  const courseLectures = await db.getLecturesByCourse(new Course(courseId, undefined, undefined));

  if (courseLectures.length > 0) {
    doesBelong = courseLectures.some((lecture) => lecture.lectureId === lectureId);
  }

  return doesBelong;
};
