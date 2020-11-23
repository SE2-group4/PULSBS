"use strict";

const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "se2group4@gmail.com", // user
        pass: "anvzRPuDd1mvCXJBfn", // password
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
    <div>The scheduled lesson at ${lessonHour} has ${studentNumber} ${
        studentNumber == 1 ? "student" : "students"
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
 * 
 * @param {*} to 
 * @param {*} subject 
 * @param {*} message 
 * @returns Promise
 */
exports.sendCustomMail = function (to,subject,message) {
    if (!to) return new Promise((resolve, reject) => reject("Undefined recipient"));

    const emailBody=`<label>${message}</label>`
    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: subject, 
        html: emailBody,
    });

    return info;
};
