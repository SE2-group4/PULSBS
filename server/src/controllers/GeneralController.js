"use strict";

const General = require("../services/GeneralService");
const utils = require("../utils/writer");

// TODO
module.exports.userLogin = function userLogin(req, res, next) {
  General.userLogin(req.body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
