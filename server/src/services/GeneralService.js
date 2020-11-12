/**
 * General dao accesses
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const dao = require('../db/Dao.js');
const User = require('../entities/User.js');

/**
 * perform login
 * @param {Object} body - email and password needed
 * @returns {Promise<Teacher|Student>} promise
 */
exports.userLogin = function(body) {
    const user = new User();
    user.email = body.email;
    user.password = body.password;

    return dao.login(user);
};
