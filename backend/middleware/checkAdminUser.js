const jwt = require('jsonwebtoken');
const config = require("../../src/config/config")
const User = require("../models/User");

const checkAdminUser = async (req, res, next) => {
  // Get the auth token from the request headers
  const authHeader = req.header("auth-token");
  let token = authHeader;
  if (authHeader && authHeader.includes('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Please provide a valid token', status:"failed" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Check if the user is an admin
    const user = await User.findById(decoded.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Only admins can access this resource', success: false, status: "failed" });
    }

    // Set the user object in the request and proceed to the next middleware
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Please provide a valid token', success: false });
  }
};

module.exports = checkAdminUser;
