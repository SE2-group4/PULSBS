/**
 * General requests and responses management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const controller = require('express').Router({ mergeParams : true });
const service = require("../services/GeneralService.js");
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const expireTime = 60 * 15; // 15 minutes
const jwtSecret = "1234567890";

/**
 * perform login
 * email and password needed
 * @returns {Teacher | Student} teacher or student
 */
controller.post('/login', [
        check('email').isEmail(),
        check('password').isString()
    ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors).end();
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    service.userLogin(email, password)
        .then((user) => {
            const token = jwt.sign({ userId: user.userId  }, jwtSecret, { expiresIn: expireTime }, { algorithm: 'RS256' });
            // res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: expireTime });
            res.cookie('token', token);
            res.status(200).json(user).end();
        })
        .catch((error) => {
            res.status(401).json(error).end();
        });
});

module.exports = controller;
