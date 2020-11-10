"use strict";

/**
 * Get all the students that have an active booking for a particular lecture
 *
 * teacherId Integer teacher id
 * courseId Integer course id
 * lectureId Integer lecture id
 * returns List
 **/
exports.teacherGetCourseLectureStudents = function (teacherId, courseId, lectureId) {
  if (isNaN(teacherId)) {
    return new Promise((resolved, reject) => reject({ error: `'teacherId' parameter is not a number: ${teacherId}` }));
  } else if (isNaN(courseId)) {
    return new Promise((resolved, reject) => reject({ error: `'courseId' parameter is not a number: ${courseId}` }));
  } else if (isNaN(lectureId)) {
    return new Promise((resolved, reject) => reject({ error: `'lectureId' parameter is not a number: ${lectureId}` }));
  }

  const tId = parseInt(teacherId);
  const cId = parseInt(courseId);
  const lId = parseInt(lectureId);

  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        firstName: "fooFirst",
        lastName: "fooLast",
        password: "fooPassword",
        type: "Student",
        userId: 1,
        email: "foo@email.com",
      },
      {
        firstName: "barFirst",
        lastName: "barLast",
        password: "barPassword",
        type: "Student",
        userId: 2,
        email: "bar@email.com",
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
  if (isNaN(teacherId)) {
    return new Promise((resolved, reject) => reject({ error: `'teacherId' parameter is not a number: ${teacherId}` }));
  } else if (isNaN(courseId)) {
    return new Promise((resolved, reject) => reject({ error: `'courseId' parameter is not a number: ${courseId}` }));
  }

  const tId = parseInt(teacherId);
  const cId = parseInt(courseId);

  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        date: "2000-01-23T10:00:00.000+00:00",
        classId: 1,
        courseId: 1,
        lectureId: 0,
      },
      {
        date: "2000-01-24T12:00:00.000+00:00",
        classId: 2,
        courseId: 1,
        lectureId: 1,
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
  if (isNaN(teacherId)) {
    return new Promise((resolved, reject) => reject({ error: `'teacherId' parameter is not a number: ${teacherId}` }));
  }
  
  const tId = parseInt(teacherId);
  
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        year: 2020,
        description: "geometry",
        courseId: 1,
      },
      {
        year: 2020,
        description: "algebra",
        courseId: 2,
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
