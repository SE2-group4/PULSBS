/**
 * test suite for the Utils module
 * @author Gastaldi Paolo
 */

'use strict'

const assert = require('assert');
const path = require('path');

const utils = require('../src/utils/utils.js');

const suite = function() {
    describe('Utils', function() {
        describe('toStandard', function() {
            const errors = [
                {
                    errno : 0,
                    location : 'test location',
                    msg : 'test message',
                    param : 'test param'
                }
            ];

            it('correct input should return specific error', function(done) {
                const retVal = utils.toStandard(errors, 999);
                assert.strictEqual(retVal.statusCode, 999, 'Wrong error code');
                assert.strictEqual(typeof retVal, typeof utils.StandardErr, 'Not a proper error');
                done();
            });

            it('wrong input should return generic string', function(done) {
                const retVal = utils.toStandard(null);
                assert.strictEqual(typeof retVal, typeof utils.StandardErr, 'Not a proper error');
                done();
            });
        });
    });
}
module.exports = suite;