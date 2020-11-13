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
 * @param {String} email
 * @param {String} password
 * @returns {Promise<Teacher|Student>} promise
 */
exports.userLogin = function(email, password) {
    const user = new User();
    user.email = email;
    user.password = password;

    return dao.login(user);
};
