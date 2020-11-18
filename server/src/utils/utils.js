/**
 * add here general functions
 * @author Gastaldi Paolo
 * @version 1.0.0
 */

 /**
  * adapter for express-validator errors
  * to create a string error message
  * @param {Array} errors
  * @return {Object} error message
  */
const errToRes = function(errors) {
    if(!(errors && errors.errors && Array.isArray(errors.errors) && errors.errors.length > 0))
        return '';

    const err = errors.errors[0];
    return err;
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
    return dateFormatter(date);
}
exports.formatDate = formatDate;
