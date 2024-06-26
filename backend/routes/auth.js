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
const checkAdminUser = require('../middleware/checkAdminUser');
const userProvider = require("../provider/user");
const Address = require('../models/Address');


//ROUTE: 1 - Create a User - Registration - POST "backend-gadgetbazaar/auth/createuser"
router.post('/createuser', [
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must have at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm password does not match');
    }
    return true;
  }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email is already registered, please login to your account!' }] });
    }

    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securedPass,
    });

    // Send registration success response
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

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
        if(user){
          user.last_login = Date.now();
          await user.save()
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
    const { email, isadminattempt } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ error: 'User not found', nouser: true });
    }
    if(isadminattempt && user.role != 'admin'){
      return res.status(200).json({error_message: "No Admin User Found with Entered Email!"})
    }
    if(!isadminattempt && user.role === 'admin'){
      return res.status(200).json({error_message: "Please use admin url to reset admin password!"})
    }
    // Create token
    const token = crypto.randomBytes(20).toString('hex');
    const forgotPasswordToken = new ForgotPasswordToken({
      user: user._id,
      token
    });
    await forgotPasswordToken.save();

    let subject = 'New Reset Password';
    let html = `
    <p>You are receiving this email because you (or someone else) have requested to reset your password.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
    <p><a href="${config.clientUrl}/resetpassword/${token}">${config.clientUrl}/resetpassword/${token}</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
    // Send email with token
    if(isadminattempt)
    {
      subject = 'New Reset Password | Admin';
      html = `
        <p>You are receiving this email because you (or someone else) have requested to reset your password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p><a href="${config.adminBaseUrl}/auth/resetpassword/${token}">${config.adminBaseUrl}/auth/resetpassword/${token}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `;
    }

    await emailService.sendEmail(user.name, user.email, subject, html);

    return res.status(200).json({ success: 'An email with reset password link has been sent to your email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//ROUTE: 5 - Reset Password - POST "backend-gadgetbazaar/auth/resetpassword/:token"
router.post('/resetpassword/:token',[
  body('password').isLength({ min: 6 }).withMessage('Password must have at least 6 characters')	
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)	
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
], async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const forgotPasswordToken = await ForgotPasswordToken.findOne({ token }).populate('user');
    if (!forgotPasswordToken || !forgotPasswordToken.user) {
      return res.status(200).json({ error_message: 'Invalid or expired token, Please get a new reset link from forgot password page!' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if token is valid


    // Update user password
    const user = forgotPasswordToken.user;
    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(password, salt);
    user.password = securedPass;
    console.log(user.password)
    await user.save();

    // Remove token from database
    await forgotPasswordToken.remove();
    
    const subject = 'Your password has been reset';
    const html = `
      <p>Your password has been reset successfully.</p>
      <p>If you did not reset your password, please contact us immediately.</p>
    `;
    await emailService.sendEmail(user.name, user.email, subject, html);

    return res.status(200).json({ success: 'Password reset successful, you will now be redirected to the login page in 5 seconds' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//ROUTE: 6 - Check If User Is Logged In - POST "backend-gadgetbazaar/auth/checkuser" Login Required
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

// ROUTE: 7 - Get User Profile - GET "/backend-gadgetbazaar/auth/getuserprofile" Login Required
router.get('/getuserprofile', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
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

// ROUTE: 8 - Update User Profile - PUT "/backend-gadgetbazaar/auth/updateuserprofile" Login Required
router.put('/updateuserprofile', fetchuser,[
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),	
  body('email').isEmail().withMessage('Invalid email'),	
  body('password').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must have at least 6 characters')	
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)	
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('contact').optional({ checkFalsy: true }).isMobilePhone('en-IN').withMessage('Invalid contact number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const { name, email, password, contact } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const securedPass = await bcrypt.hash(req.body.password, salt);
        user.password = securedPass;
      }
      user.contact = contact || user.contact;
      const updatedUser = await user.save();
      if(password){
        const name = req.user.name; // Get the user's name from the authenticated user object
        const email = req.user.email; // Get the user's email from the authenticated user object
        const subject = 'Password Changed'; // Email subject
        const html = `
          <p>Your password has been successfully changed.</p>
          <p>If you did not initiate this change, please contact us immediately.</p>
          <p>Thank you for using our services!</p>
        `;

        try {
          await sendEmail(name, email, subject, html); // Send the email
          console.log(`Password changed email sent to ${email}`);
        } catch (error) {
          console.error(`Error sending password changed email to ${email}: ${error.message}`);
        }
      }
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        success: "Profile updated successfully"
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE: 9 - Check if User is admin - GET "/backend-gadgetbazaar/auth/isadmin" Login Required
router.get('/isadmin', fetchuser, async (req, res) => {
  try {
  let userId = null;
    if(req.user)
      userId = req.user.id;
    if(userId){
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send('User not found');
      } else {
          // Check if user is an admin
        if (user.role === 'admin') {
          res.json({
            status: 'success',
            is_admin: true
          });
        } else {
          res.json({
            status: 'failed',
            is_admin: false
          });
        }
      }
    }else{
      res.json({
        status: 'failed',
        is_admin: false
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
// ROUTE: 10 - Send OTP - POST "/backend-gadgetbazaar/auth/sendMobileVerificationMessage" Login Required
router.post('/sendMobileVerificationMessage',fetchuser, async (req, res) => {
  try {
    const userId  = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const GADGETBAZAAR_MSG_API_AUTH_KEY = userProvider.GADGETBAZAAR_MSG_API_AUTH_KEY;
    const GADGETBAZAAR_MSG_API_LINK = userProvider.GADGETBAZAAR_MSG_API_LINK;
    const GADGETBAZAAR_MSG_API_SID = userProvider.GADGETBAZAAR_MSG_API_SID;
    const country_code = '+91';
    const OTP = Math.floor(Math.random() * 900000) + 100000;
    user.mobile_otp = OTP;
    await user.save();


    const url = `${GADGETBAZAAR_MSG_API_LINK}authkey=${GADGETBAZAAR_MSG_API_AUTH_KEY}&mobile=${user.contact}&country_code=${country_code}&sid=${GADGETBAZAAR_MSG_API_SID}&company=GadgetBazaar Account&name=${user.name}&otp=${user.mobile_otp}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log()
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+ err });
  }
});
// ROUTE: 11 - Verify OTP - POST "/backend-gadgetbazaar/auth/contact/verifyotp/:otp" Login Required
router.post('/contact/verifyotp/:otp', fetchuser, async (req, res) => {
  try {
    const otp  = req.params.otp;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(user){
      if(user.mobile_otp){
        if(user.mobile_otp === otp){
          user.mobile_otp = "";
          user.is_mobile_verified = true;
          await user.save();
          return res.status(200).json({success: "Contact verified successfully"})
        }
      }
    }

     return res.status(200).json({errors: [{msg:"Contact verification failed, Please try again!"}]})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+ err });
  }
});
// ROUTE: 12 - Send Email OTP - POST "/backend-gadgetbazaar/auth/sendEmailVerificationMessage" Login Required
router.post('/sendEmailVerificationMessage',fetchuser, async (req, res) => {
  try {
    const userId  = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const OTP = Math.floor(Math.random() * 900000) + 100000;
    user.email_otp = OTP;
    await user.save();


    let subject = 'Email Verification';
    let html = `
    <p>You are receiving this email because you (or someone else) have requested to verify your email on GadgetBazaar.</p>
    <p>Please use this OTP to verify your email: <b> ${OTP} </b></p>
    <p>If you did not request this, please ignore this email.</p>
  `;

    await emailService.sendEmail(user.name, user.email, subject, html);

    return res.status(200).json({ success: 'OTP Sent on Your Email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({errors: [{msg:err}]},{ message: 'Internal server error: '+ err });
  }
});
// ROUTE: 13 - Verify Email OTP - POST "/backend-gadgetbazaar/auth/email/verifyotp/:otp" Login Required
router.post('/email/verifyotp/:otp', fetchuser, async (req, res) => {
  try {
    const otp  = req.params.otp;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(user){
      if(user.email_otp){
        if(user.email_otp === otp){
          user.email_otp = "";
          user.is_email_verified = true;
          await user.save();
          return res.status(200).json({success: "Email verified successfully"})
        }
      }
    }

     return res.status(200).json({errors: [{msg:"Email verification failed, Please try again!"}]})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+ err });
  }
});
// ROUTE: 14 - Get All Addresses - GET "/backend-gadgetbazaar/auth/addresses/getall" Login Required
router.get('/addresses/getall', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ROUTE: 15 - Edit Address - PUT "/backend-gadgetbazaar/auth/addresses/edit/:id" Login Required
router.put('/addresses/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { address_line_1, address_line_2, city, state, country, pincode, contact } = req.body;

  try {
    // Find the address by ID
    const address = await Address.findById(id);

    if (!address) {
      return res.status(200).json({ errors: [{ msg:'Address not found'}], success: false});
    }
     // Check if required fields are passed
     if (!address_line_1 || !city || !state || !pincode) {
      return res.status(200).json({ errors: [{msg:'Required fields are missing'}],success: false });
    }


    // Update the address fields
    address.address_line_1 = address_line_1;
    address.address_line_2 = address_line_2;
    address.city = city;
    address.state = state;
    address.country = country;
    address.pincode = pincode;
    address.contact = contact;

    // Save the updated address
    await address.save();
    res.json({address, success: "Address updated successfully"});
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/addresses/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    console.log(address)
    
    res.json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch address by id' });
  }
});
router.post('/addresses/create', fetchuser,[
  body('address_line_1', 'Please enter Address line 1!').notEmpty(),
  body('city', 'Please select a city!').notEmpty(),
  body('state', 'Please select a state!').notEmpty(),
  body('pincode', 'Please enter pincode!').notEmpty(),
], async (req, res) => {
  // Retrieve the address data from the request body
  const user_id = req.user.id;
  const { address_line_1, address_line_2, city, state, country, pincode, contact } = req.body;

  try {
    // Check if required fields are passed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    if (!address_line_1 || !city || !state || !pincode) {
      return res.status(400).json({ errors: [{ msg: 'Required fields are missing' }], success: false });
    }

       // Check if an address with the same details already exists
       const existingAddress = await Address.findOne({ address_line_1, city, state,country, pincode, user_id });

       if (existingAddress) {
         return res.status(200).json({ errors: [{ msg: 'Address with the same details already exists' }], success: false });
       }
    // Create a new address instance
    const newAddress = new Address({
      user_id,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
      contact
    });

    // Save the new address to the database
    const savedAddress = await newAddress.save();

    // Assuming the address is successfully added, you can send a response back
    res.status(200).json({ address: savedAddress, success: 'Address added successfully' });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;