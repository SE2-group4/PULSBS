/**
 * all unit tests
 * @author Gastaldi Paolo
 */
'use strict';

const dao = require('../src/db/Dao.js');
const Test_Dao = require('./Test_Dao.js');
const Test_Utils = require('./Test_Utils.js');
const Test_services = require('./Test_services.js');

/**
 * all system unit test
 */
describe('System', function () {
    before(function(done) {
        dao.openConn('testing.db', done);
    });

    describe('Unit tests', function() {
        Test_Dao();
        Test_Utils();
    });

    describe('Integration tests', function() {
        Test_services();
    });
})
