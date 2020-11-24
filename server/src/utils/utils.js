/**
 * add here general functions
 * @author Gastaldi Paolo
 * @version 1.0.0
 */

 /**
  * adapter for express-validator errors
  * to create a standard error object
  * @param {Array} errors
  * @param {Number} code
  * @return {Object} a standard error object
  */
const errToRes = function(errors, code) {
    if(!(errors && errors.errors && Array.isArray(errors.errors) && errors.errors.length > 0))
        return '';

    const err = errors.errors[0];
    const standardErr = {
        msg: err.msg + ' ' + err.location,
        status: code
    };
    return standardErr;
}
exports.errToRes = errToRes;

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
