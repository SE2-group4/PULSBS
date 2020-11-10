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
exports.studentBookLecture = function (studentId, courseId, lectureId) {
  // TODO update the openapi docs. We should return something in case of status code 200
  if (isNaN(studentId)) {
    return new Promise((resolve, reject) => reject({error: `'studentId parameter is not a number: ${studentId}`}));
  } else if (isNaN(courseId)) {
    return new promise((resolve, reject) => reject({error: `'courseid parameter is not a number: ${courseid}`}));
  } else if (isNaN(lectureId)) {
    return new promise((resolve, reject) => reject({error: `'lectureId parameter is not a number: ${lectureId}`}));
  }

  const sId = studentId;
  const cId = courseId;
  const lId = lectureId;
  
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
  if (isNaN(studentId)) {
    return new Promise((resolve, reject) => reject({error: `'studentId parameter is not a number: ${studentId}`}));
  } else if (isNaN(courseId)) {
    return new Promise((resolve, reject) => reject({error: `'courseId parameter is not a number: ${courseId}`}));
  }

  const sId = studentId;
  const cId = courseId;

  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        date: "2000-01-22T10:00:00.000+00:00",
        classId: 1,
        courseId: 2,
        lectureId: 10,
      },
      {
        date: "2000-01-23T12:00:00.000+00:00",
        classId: 1,
        courseId: 2,
        lectureId: 11,
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
  if (isNaN(studentId)) {
    return new Promise((resolve, reject) => reject({error: `'studentId parameter is not a number: ${studentId}`}));
  }

  const sId = studentId;

  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = [
      {
        year: 2020,
        description: "software enginnering",
        courseId: 0,
      },
      {
        year: 2020,
        description: "yoga",
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
