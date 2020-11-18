/**
 * add here general functions
 * @author Gastaldi Paolo
 * @version 1.0.0
 */

 /**
  * adapter for express-validator errors
  * to create a string error message
  * @param {Array} errors
  * @return {String} error message
  */
const errToString = function(errors) {
    if(!(errors && errors.errors && Array.isArray(errors.errors) && errors.errors.length > 0))
        return '';

    const err = errors.errors[0];
    return err;
}
exports.errToString = errToString;
