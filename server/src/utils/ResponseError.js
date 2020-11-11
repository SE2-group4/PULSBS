"use strict";

/**
 * wrapper for an error message
 * @param {Number} statusCode
 * @param {String} error
 * @param {String} source
 */
class ResponseError {
  constructor(source, error, statusCode = 500) {
    this.payload = { source: source, error: error, statusCode: statusCode };
    this.statusCode = statusCode;
  }
}

module.exports.ResponseError = ResponseError;
