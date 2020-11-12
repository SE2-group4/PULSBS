"use strict";

const nodemailer = require("nodemailer");

exports.sendConfirmationBookingEmail = function (to, courseName, lessonHour) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'se2group4@gmail.com', // user
            pass: 'anvzRPuDd1mvCXJBfn', // password
        },
        tls: {
            rejectUnauthorized: false //this is for local hosting
        }
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: "Confirmation of class booking.", // Subject line
        html: `<b>Your class for ${courseName} booked at ${lessonHour}</b>`, // html body
    });

    console.log("Mail sent to " + to);
}

exports.sendStudentNumberEmail = function (to, courseName, lessonHour, studentNumber) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'se2group4@gmail.com', // user
            pass: 'anvzRPuDd1mvCXJBfn', // password
        },
        tls: {
            rejectUnauthorized: false //this is for local hosting
        }
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"PULSeBS Email System" <PULSeBS@service.com>', // sender address
        to: to, // list of receivers
        subject: "Number of class students", // Subject line
        html: `<b>Your class for ${courseName} scheduled at ${lessonHour} is going to have ${studentNumber} students.</b>`, // html body
    });

    console.log("Mail sent to " + to);
}