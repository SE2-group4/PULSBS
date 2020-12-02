const { ResponseError } = require("./ResponseError");
/**
 * Usage writeJson(response, statusCode); case 1
 *       writeJson(response, payload); case 2
 *       writeJson(response, payload, statusCode); case 3
 *       writeJson(response, statusCode, payload); case 4
 *       writeJson(response, ResponseError); case 5
 * statusCode {Integer}
 * payload MUST NOT BE a INTEGER
 * description: fills the response and sends it back 
 **/
const writeJson = (exports.writeJson = function (response, arg1, arg2) {
  let code;
  let payload;

  if (arg1 && arg1 instanceof ResponseError) {
    // case 5
    writeJson(response, arg1.payload, arg1.statusCode);
    return;
  }

  if (arg2 && Number.isInteger(arg2)) {
    // case 3
    code = arg2;
    if (arg1) payload = arg1;
  } else if (arg1 && Number.isInteger(arg1)) {
    // case 1, 4
    code = arg1;
    if (arg2) payload = arg2;
  } else if (arg1) {
    // case 2
    payload = arg1
  }

  // if no response code given, we default to 200
  if (!code) code = 200;

  if (typeof payload === "object") {
    payload = JSON.stringify(payload, null, 2);
  }

  response.writeHead(code, { "Content-Type": "application/json" });
  // response.status(code).set(code, { "Content-Type": "application/json" });
  response.end(payload);
});
