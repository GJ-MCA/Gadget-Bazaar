const express = require('express');
const User = require('../models/User')
const router = express.Router();
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const ForgotPasswordToken = require('../models/ForgotPasswordToken');
const crypto = require('crypto');
const config = require("../../src/config/config");
const isLoggedIn = require('../middleware/isLoggedIn');
const emailService = require('../services/emailService');



//ROUTE: 1 - Create a User - Registration - POST "backend-gadgetbazaar/auth/createuser"
router.post('/createuser',[
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),	
  body('email').isEmail().withMessage('Invalid email'),	
  body('password').isLength({ min: 6 }).withMessage('Password must have at least 6 characters')	
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)	
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
      //Check whether the user with this email exists already
      let user = await User.findOne({email: req.body.email});
      /*        
      if(user){
        return res.status(400).json({error: "Email already registered"})
      } */
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: securedPass,
      });
      const data = {
          user: {
              id: user.id
          }
      }
      const authtoken = jwt.sign(data, config.jwtSecret);
      res.json({authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create user' });
    }
    
})

//ROUTE: 2 - Authenticate the User - Login - POST "backend-gadgetbazaar/auth/login"
router.post('/login',[
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password Can Not be Blank' ).exists(),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
 
    const {email,password, isadminattempt} = req.body;
    //Check whether the user with this email exists already

    let user = await User.findOne({email});
    try{
        if(!user){
            return res.status(400).json({error: "Email or Password is Not Correct, Please Check Your Details and Try Again!"})
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(400).json({error: "Email or Password is Not Correct, Please Check Your Details and Try Again!"})
        }
        const data = {
            user: {
                id: user.id
            }
        }
        if(isadminattempt && user.role != 'admin'){
          return res.status(401).json({error: "You are not authorized to access admin page"})
        }
        const authtoken = jwt.sign(data, config.jwtSecret);
        res.json({authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE: 3 - Get Logged in User Details - POST "backend-gadgetbazaar/auth/getuser" Login Required
router.post('/getuser', fetchuser, async (req,res)=> {
    try{
        let userID = req.user.id;

        const user = await User.findById(userID).select("-password");
        if(user){
            res.send(user);
        }else{
            res.status(400).send("User Not Found");
        }
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE: 4 - Forgot Password - POST "backend-gadgetbazaar/auth/forgotpassword"
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create token
    const token = crypto.randomBytes(20).toString('hex');
    const forgotPasswordToken = new ForgotPasswordToken({
      user: user._id,
      token
    });
    await forgotPasswordToken.save();

    // Send email with token
    const subject = 'New Reset Password';
    const html = `
    <p>You are receiving this email because you (or someone else) have requested to reset your password.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
    <p><a href="${config.clientUrl}/resetpassword/${token}">${config.clientUrl}/resetpassword/${token}</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
    await emailService.sendEmail(user.name, user.email, subject, html);

    return res.status(200).json({ success: 'An email with reset password link has been sent to your email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
//ROUTE: 5 - Check If User Is Logged In - POST "backend-gadgetbazaar/auth/checkuser" Login Required
router.post('/checkuser', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
          const loggedIn = isLoggedIn(token);
          if (loggedIn) {
            res.status(200).send('User is logged in');
        } else {
          res.status(401).send('Unauthorized: Invalid token');
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });

// ROUTE: 6 - Get User Profile - GET "/backend-gadgetbazaar/auth/getuserprofile" Login Required
router.get('/getuserprofile', fetchuser, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE: 7 - Update User Profile - PUT "/backend-gadgetbazaar/auth/updateuserprofile" Login Required
router.put('/updateuserprofile', fetchuser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password, contact } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password;
      }
      user.contact = contact || user.contact;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;