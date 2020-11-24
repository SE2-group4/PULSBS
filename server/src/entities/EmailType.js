/**
 * EmailType enumeration
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
'use strict';

/**
 * @deprecated - use Email.EmailType
 */
const EmailType = {
    ERROR : 'ERROR',
    UNDEFINED : 'UNDEFINED',
    STUDENT_NEW_BOOKING : 'STUDENT_NEW_BOOKING',
    TEACHER_ATTENDING_STUDENTS : 'TEACHER_ATTENDING_STUDENTS'
    // add more here
}

module.exports = EmailType;