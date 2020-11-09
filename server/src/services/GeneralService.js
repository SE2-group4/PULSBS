"use strict";

/**
 * User request to sign in system
 *
 * body Login The credetials needed are email and password
 * returns Student
 **/
exports.userLogin = function (body) {
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = {
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      type: "Student",
      userId: 1,
      email: "fake@email.com",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
