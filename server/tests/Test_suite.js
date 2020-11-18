/**
 * all unit tests
 * @author Gastaldi Paolo
 */
'use strict';

const Test_dao = require('./Test_dao.js');
const Test_email = require('./Test_email.js');

describe('backend', function () {
    Test_dao(); // not an error
})

describe('email', function () {
    Test_email();
})