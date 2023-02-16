const express = require('express');
const User = require('../models/User')
const router = express.Router();
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "G@dgetB^z@^r_$ecured";

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
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Sorry, User With This Email Already Exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const securedPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPass,
            isadmin: req.body.isadmin,
            contact: req.body.contact,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        console.log(JWT_SECRET)
        const authtoken = jwt.sign(data, JWT_SECRET);
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
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE: 3 - Get Logged in User Details - POST "gadgetbazaar/auth/getuser"
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
module.exports = router;