"use strict";

const General = require("../services/GeneralService");
const utils = require("../utils/writer");

// TODO
module.exports.userLogin = function userLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  General.userLogin(email, password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
