"use strict";

/**
 * get all the students that have an active booking for a particular lecture
 *
 * teacherId Integer teacher id
 * courseId Integer course id
 * lectureId Integer lecture id
 * returns List
 **/
exports.teacherGetCourseLectureStudents = function (teacherId, courseId, lectureId) {
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        firstName: "firstName",
        lastName: "lastName",
        password: "password",
        type: "Student",
        userId: 1,
        email: "fake@email.com",
      },
      {
        firstName: "firstName",
        lastName: "lastName",
        password: "password",
        type: "Student",
        userId: 2,
        email: "fake@email.com",
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * get all active lectures for a particular course
 * Get all active lectures, which are stil not delivered, for a course taught by a particular professor
 *
 * teacherId Integer teacher id
 * courseId Integer course id
 * returns List
 **/
exports.teacherGetCourseLectures = function (teacherId, courseId) {
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        date: "2000-01-23T04:56:07.000+00:00",
        classId: 1,
        courseId: 6,
        lectureId: 0,
      },
      {
        date: "2000-01-23T04:56:07.000+00:00",
        classId: 1,
        courseId: 6,
        lectureId: 0,
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * get all taught courses of this academic year
 *
 * teacherId Integer teacher id
 * returns List
 **/
exports.teacherGetCourses = function (teacherId) {
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        year: 2020,
        description: "description",
        courseId: 0,
      },
      {
        year: 2020,
        description: "description",
        courseId: 0,
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
