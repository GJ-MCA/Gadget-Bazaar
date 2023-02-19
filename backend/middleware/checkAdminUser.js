const jwt = require('jsonwebtoken');
const config = require("../../src/config/config")
const AdminUser = require("../models/Admin_User");

const checkAdminUser = async (req, res, next) => {
  // Get the auth token from the request headers
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Please provide a valid token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if the user is an admin
    const admin_user = await AdminUser.findById(decoded.user._id);
    if (admin_user) {
      return res.status(401).json({ error: 'Unauthorized: Only admins can access this resource' });
    }

    // Set the user object in the request and proceed to the next middleware
    req.admin_user = admin_user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Please provide a valid token' });
  }
};

module.exports = checkAdminUser;
