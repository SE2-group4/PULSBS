"use strict";
const nodemailer = require("nodemailer");

const defaultTemplates = {
    LESSON_CANCELLED: {
        subject: "Course {0} - LECTURE CANCELLED",
        message: "Dear student,\nyour lecture scheduled for {0} has been cancelled.\n",
    },
    LESSON_UPDATE_DELIVERY: {
        subject: "Course {0} - LECTURE UPDATE DELIVERY MODE",
        message: "Dear student,\nyour lecture scheduled for {0} has been switched to {1} mode.\n",
    },
    STUDENT_NEW_BOOKING: {
        subject: "Course {0} - LECTURE BOOKED",
        message: "Dear student,\na seat your lecture scheduled for {0} at {1} in class {2} has been correctly booked.\n",
    },
    STUDENT_PUSH_QUEUE: {
        subject: "Course {0} - INSERTED INTO WAITING LIST",
        message: "Dear student,\nas no more seats are available for the lecture of {0} at {1} you have been inserted into a waiting list.\n",
    },
    STUDENT_POP_QUEUE: {
        subject: "Course {0} - TAKEN FROM THE WAITING LIST",
        message: "Dear student,\nyou have been picked from the waiting list for the lecture scheduled for {0} at {1} in class {2}. You seat has been properly booked.\n",
    },
    STUDENT_UPDATE_SCHEDULE: {
        subject: "Course {0} - COURSE SCHEDULE CHANGED",
        message: "Dear student,\ndue to a course schedule change your lecture of {0} at {1} in class {2} has been moved at {3} in class {4}. Your booking has been removed, please book again.\n",
    },
};

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    requireTLS: true, // Compliant
    secured: true, // Compliant
    auth: {
        user: "trasporter.se2group4@gmail.com", // user
        pass: "trasporter46!", // password
    },
    tls: {
        rejectUnauthorized: false, //this is for local hosting
    },
});

/**
 *
 * @param {String} to
 * @param {String} courseName
 * @param {String} lessonHour
 * @returns Promise
 */

exports.sendConfirmationBookingEmail = function (to, courseName, lessonHour) {
    if (!to) return new Promise((resolve, reject) => reject("Undefined recipient"));

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: "Confirmation of class booking.", // Subject line
        html: `<b>Your class for ${courseName} booked at ${lessonHour}</b>`, // html body
    });

    return info;
};

/**
 *
 * @param {String} to
 * @param {String} courseName
 * @param {String} lessonHour
 * @param {int} studentNumber
 * @returns Promise
 */

exports.sendStudentNumberEmail = function (to, courseName, lessonHour, studentNumber) {
    if (!to) return new Promise((resolve, reject) => reject("Undefined recipient"));

    const emailSubject = `Summary: course ${courseName} lecture ${lessonHour}`;
    const emailBody = `<label>Course: <b>${courseName}</b></label>\
    <div>The scheduled lesson at ${lessonHour} has ${studentNumber} ${studentNumber == 1 ? "student" : "students"
        } booked</div>`;

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: emailSubject,
        html: emailBody,
    });

    return info;
};

/**
 * @param {*} to
 * @param {*} subject
 * @param {*} message
 * @returns Promise
 */
exports.sendCustomMail = function (to, subject, emailBody) {
    if (!to) return new Promise((resolve, reject) => reject("Undefined recipient"));

    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: subject,
        html: emailBody,
    });

    return info;
};

exports.getDefaultEmail = function getDefaultEmail(emailType = "", subjectArgs = [], messageArgs = []) {
    if (!defaultTemplates.hasOwnProperty(emailType)) {
        return {};
    }

    if (messageArgs.length == 0) messageArgs = subjectArgs;

    const subject = getDefaultEmailSubject(emailType, subjectArgs);
    const message = getDefaultEmailMessage(emailType, messageArgs);
    return { subject, message };
};

function formatString(str, args) {
    let a = str;
    for (let k in args) {
        a = a.replace("{" + k + "}", args[k]);
    }
    return a;
}
module.exports.formatString = formatString;

function getDefaultEmailSubject(emailType, args) {
    return formatString(defaultTemplates[emailType].subject, args);
}

function getDefaultEmailMessage(emailType, args) {
    return formatString(defaultTemplates[emailType].message, args);
}

