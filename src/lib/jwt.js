/**
 * module to encapsulate jwt functionality
 */
const jwt = require("jsonwebtoken");

// THIS KEY SHOULD BE PROVIDED AN ENV FILE AND BE KEPT SECRET
// IN A PRODUCTION ENVIRONMENT
const DUMMY_TOKEN_KEY = 'DUMMY_TOKEN_KEY';

function sign(payload) {
  return jwt.sign(
    payload,
    DUMMY_TOKEN_KEY,
    { expiresIn: "2h" }
  );
}

function verify(token) {
  const data = jwt.verify(token, DUMMY_TOKEN_KEY);
  return data;
}

module.exports = { sign, verify }