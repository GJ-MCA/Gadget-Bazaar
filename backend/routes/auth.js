const express = require('express');
const User = require('../models/User')
const router = express.Router();
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const ForgotPasswordToken = require('../models/ForgotPasswordToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require("../../src/config/config")
//ROUTE: 1 - Create a User - Registration - POST "gadgetbazaar/auth/createuser"
router.post('/createuser',[
    body('name','Enter At Least 3 Characters').isLength({min: 3}),
    body('email','Enter a Valid Email').isEmail(),
    body('password','Enter At Least 6 Characters').isLength({min: 6}),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        //Check whether the user with this email exists already
/*         let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Sorry, User With This Email Already Exists"})
        } */
        const salt = await bcrypt.genSalt(10);
        const securedPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPass,
            contact: req.body.contact,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        console.log(config.jwtSecret)
        const authtoken = jwt.sign(data, config.jwtSecret);
        res.json({authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE: 2 - Authenticate the User - Login - POST "gadgetbazaar/auth/login"
router.post('/login',[
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password Can Not be Blank' ).exists(),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
 
    const {email,password} = req.body;
    console.log(email)
    console.log(password)
    //Check whether the user with this email exists already

    let user = await User.findOne({email});
    try{
        if(!user){
            return res.status(400).json({error: "Email or Password is Not Correct, Please Check Your Details and Try Again!"})
        }
        console.log(user)
        console.log(user.password);
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(400).json({error: "Email or Password is Not Correct, Please Check Your Details and Try Again!"})
        }
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
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE: 3 - Get Logged in User Details - POST "gadgetbazaar/auth/getuser" Login Required
router.post('/getuser', fetchuser, async (req,res)=> {
    try{
        userID = req.user.id;
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

//ROUTE: 4 - Forgot Password - POST "gadgetbazaar/auth/forgotpassword"
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
    const transporter = nodemailer.createTransport({
      service: config.emailService,
      auth: {
        user: config.emailAddress,
        pass: config.emailPassword
      }
    });
    const mailOptions = {
      from: config.emailAddress,
      to: user.email,
      subject: 'Reset Password - Gadget Bazaar',
      text: `You are receiving this email because you (or someone else) have requested to reset your password.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${config.clientUrl}/resetpassword/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: 'An email with reset password link has been sent to your email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;