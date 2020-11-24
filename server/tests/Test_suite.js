/**
 * all unit tests
 * @author Gastaldi Paolo
 */
'use strict';

const Test_dao = require('./Test_dao.js');
const Test_services = require('./Test_services.js');

/**
 * all system unit test
 */
describe('System', function () {
    Test_dao();
    Test_services();
})