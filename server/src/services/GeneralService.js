"use strict";

/**
 * User request to sign in system
 *
 * body Body { email: 'fake@email.com', password: 'password' } 
 * returns a Student
 **/
exports.userLogin = function (body) {
  console.log(body);
  return new Promise(function (resolve, reject) {
    let examples = {};
    examples["application/json"] = {
      firstName: "foo",
      lastName: "bar",
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
