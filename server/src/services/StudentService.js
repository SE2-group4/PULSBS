"use strict";

/**
 * book a particular lecture
 *
 * body Body The id of the student that want to book a lecture
 * studentId Integer student id
 * courseId Integer course id
 * lectureId Integer lecture id
 * no response value expected for this operation
 **/
exports.studentBookLecture = function (body, studentId, courseId, lectureId) {
  return new Promise(function (resolve, reject) {
    resolve("Lecture Booked");
  });
};

/**
 * get all active lectures of a particular course
 * Get all active lectures, which are still not delivered, for a course enrolled by a particular student
 *
 * studentId Integer student id
 * courseId Integer course id
 * returns List
 **/
exports.studentGetCourseLectures = function (studentId, courseId) {
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
 * get all enrolled courses in this academic year
 *
 * studentId Integer student id
 * returns List
 **/
exports.studentGetCourses = function (studentId) {
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
