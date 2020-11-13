/**
 * General requests and responses management
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

const controller = require('express').Router();
const service = require("../services/GeneralService.js");
const { check, validationResult } = require('express-validator');
const jsonwebtoken = require('jsonwebtoken');

const expireTime = 60 * 15; // 15 minutes

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
        res.status(401).json(errors[0]).end();
        return;
    }

    const email = req.params.email;
    const password = req.params.password;
        service.userLogin(email, password)
        .then((user) => {
            const token = jsonwebtoken.sign({ userId: user.userId }, jwtSecret, { expiresIn: expireTime });
            res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: expireTime });
            res.status(200).json(user).end;
        })
        .catch((error) => {
            res.status(401).json(error).end();
        });
});

module.exports = controller;
