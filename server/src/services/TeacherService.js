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
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
  } else if (isNaN(lectureId)) {
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { lectureId }, 400);
  }

  const tId = Number(teacherId);
  const cId = Number(courseId);
  const lId = Number(lectureId);

  // checking whether the teacher is in charge of this course during this academic year
  let isTeachingThisCourse = await isCourseTeachedBy(tId, cId);

  if (!isTeachingThisCourse) {
    return new ResponseError("TeacherService", ResponseError.TEACHER_COURSE_MISMATCH_AA, { courseId, teacherId }, 404);
  }

  // checking whether the teacher is in charge of this course during this academic year
  let doesLectureBelong = await doesLectureBelongCourse(cId, lId);

  if (!doesLectureBelong) {
    return new ResponseError("TeacherService", ResponseError.COURSE_LECTURE_MISMATCH_AA, { lectureId, courseId }, 404);
  }

  const lecture = new Lecture(lId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder
  try {
    const lectureStudents = await db.getStudentsByLecture(lecture);
    return lectureStudents;
  } catch (err) {
    return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
  }
};

/**
 * Get all active lectures, which have not yet been delivered, for a course taught by a given professor
 *
 * teacherId Integer
 * courseId Integer
 * returns array of lectures. In case of error an ResponseError
 **/
exports.teacherGetCourseLectures = async function (teacherId, courseId) {
  if (isNaN(teacherId)) {
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
  } else if (isNaN(courseId)) {
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { courseId }, 400);
  }

  const tId = Number(teacherId);
  const cId = Number(courseId);

  // checking whether the teacher is in charge of this course during this academic year
  let isTeachingThisCourse = await isCourseTeachedBy(tId, cId);

  if (!isTeachingThisCourse) {
    return new ResponseError("TeacherService", ResponseError.TEACHER_COURSE_MISMATCH_AA, { courseId, teacherId }, 404);
  }

  try {
    // I put the other fields in as a reminder
    const course = new Course(cId, undefined, undefined);
    const courseLectures = await db.getLecturesByCourse(course);
    return courseLectures;
  } catch (err) {
    return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
  }
};

/**
 * Get all courses taught in this academic year by a given professor
 *
 * teacherId Integer
 * returns array of courses. In case of error an ResponseError
 **/
exports.teacherGetCourses = async function (teacherId) {
  if (isNaN(teacherId)) {
    return new ResponseError("TeacherService", ResponseError.PARAM_NOT_INT, { teacherId }, 400);
  }

  const tId = Number(teacherId);
  const teacher = new Teacher(tId, undefined, undefined, undefined, undefined); // I also put the other fields in as a reminder

  try {
    const teacherCourses = await db.getCoursesByTeacher(teacher);
    return teacherCourses;
  } catch (err) {
    return new ResponseError("TeacherService", ResponseError.DB_GENERIC_ERROR, err, 500);
  }
};

/**
 * Check whether a teacher is in charge of a course during this academic year
 *
 * teacherId Integer
 * courseId Integer
 * returns boolean
 **/
const isCourseTeachedBy = async (teacherId, courseId) => {
  let isTeachingThisCourse = false;

  const teacherCourses = await db.getCoursesByTeacher(
    new Teacher(teacherId, undefined, undefined, undefined, undefined)
  );

  if (teacherCourses.length > 0) {
    isTeachingThisCourse = teacherCourses.some((course) => course.courseId === courseId);
  }

  return isTeachingThisCourse;
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
