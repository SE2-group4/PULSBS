/**
 * add here general functions
 * @author Gastaldi Paolo
 * @version 1.0.0
 */

 /**
  * class for the standard error format
  */
class StandardErr {
    /**
     * class constructor
     * @param {String} source 
     * @param {Number} errno 
     * @param {String} message 
     * @param {Number} statusCode 
     */
    constructor(source = 'none', errno = -1, message = 'none', statusCode = 500) {
        this.source = source;
        this.errno = errno;
        this.message = message;
        this.statusCode = statusCode;
    }
};
exports.StandardErr = StandardErr;

 /**
  * adapter for express-validator errors
  * to create a standard error object
  * @param {Array} errors
  * @param {Number} code
  * @return {Object} a standard error object
  */
const toStandard = function(errors, code) {
    if(!(errors && errors.errors && Array.isArray(errors.errors) && errors.errors.length > 0))
        return '';

    const err = errors.errors[0];
    return new StandardErr('request ' + err.location, undefined,  err.msg + ' ' + err.location, code);
}
exports.toStandard = toStandard;

/**
 * format a date properly for the email usage
 * @param {Date} date 
 * @returns {String} formatted date
 */
const formatDate = function(date) {
    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
        timeZone: 'Europe/Rome'
    }
    const dateFormatter = new Intl.DateTimeFormat('en-GB', options);
    return dateFormatter.format(date);
}
exports.formatDate = formatDate;
