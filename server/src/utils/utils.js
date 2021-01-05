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
    constructor(source = "none", errno = -1, message = "none", statusCode = 500) {
        this.source = source;
        this.errno = errno;
        this.message = message;
        this.statusCode = statusCode;
    }

    /**
     * list of possible internal errors
     * HTTP errors: form 1xx to 5xx
     * please do not mix codes, even if they refer to different topics (except for the GENERIC errno)
     */
    static errno = {
        GENERIC: 0,
        FAILURE: 700,
        NOT_ALLOWED: 701,
        PARAMS_MISMATCH: 730,
        UNEXPECTED_VALUE: 731,
        UNEXPECTED_TYPE: 732,
        ALREADY_PRESENT: 733,
        NOT_EXISTS: 734,
        WRONG_VALUE: 735,
        NOT_AVAILABLE: 736,
        // add more here
    };

    /**
     * create a proper error object
     * @param {String} source
     * @param {Number} errno
     * @param {String} message
     * @param {Number} statusCode
     * @returns new error object
     */
    static new(source, errno, message, statusCode) {
        // return { error : new StandardErr(source, errno, message, statusCode)};
        return new StandardErr(source, errno, message, statusCode);
    }

    /**
     * dao errors adapter
     * @param {Object} err - sqlite error
     * @returns new error object
     */
    static fromDao(err) {
        return StandardErr.new("Dao", StandardErr.errno.GENERIC, err.message);
    }
}
exports.StandardErr = StandardErr;

/**
 * adapter for express-validator errors
 * to create a standard error object
 * @param {Array} errors
 * @param {Number} code
 * @return {Object} a standard error object
 */
const toStandard = function (errors, code) {
    if (!(errors && errors.errors && Array.isArray(errors.errors) && errors.errors.length > 0))
        return StandardErr.new("System", StandardErr.errno.GENERIC, "not specified");

    const err = errors.errors[0];
    return StandardErr.new("Request " + err.location, StandardErr.errno.GENERIC, err.msg + " " + err.location, code);
};
exports.toStandard = toStandard;

/**
 * format a date properly for the email usage
 * @param {Date} date
 * @returns {String} formatted date
 */
const formatDate = function (date) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: "Europe/Rome",
    };
    const dateFormatter = new Intl.DateTimeFormat("it-IT", options);

    return dateFormatter.format(date);
};
exports.formatDate = formatDate;

console.email = function (msg) {
    console.log("EMAIL: ".green + msg);
};

console.info = function (msg) {
    console.log("INFO: ".green + msg);
};
