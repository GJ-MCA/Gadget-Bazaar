const jwt = require('jsonwebtoken');
const config = require("../../src/config/config")

const isLoggedIn = (token) => {
    if (!token) {
      return false;
    }
    try {
      const data = jwt.verify(token, config.jwtSecret);
      if (data) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };


  module.exports = isLoggedIn;