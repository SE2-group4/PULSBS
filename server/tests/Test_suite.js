/**
 * all unit tests
 * @author Gastaldi Paolo
 */
'use strict';

const Test_dao = require('./Test_dao.js');
const Test_email = require('./Test_email.js');

/**
 * all system unit test
 */
describe('System', function () {
    Test_dao();
    Test_email();
})