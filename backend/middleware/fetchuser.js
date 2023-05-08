const jwt = require('jsonwebtoken');
const config = require('../../src/config/config');

const fetchuser = (req,res,next) => {
    // Get user from the jwt token and add id to req object
    const authHeader = req.header("auth-token");
    let token = authHeader;
    if (authHeader && authHeader.includes('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({ error: "Please authenticate using a valid token", status: "failed" });
    }
    try{
        const data = jwt.verify(token,config.jwtSecret);
        req.user = data.user;
        next();
    } catch(error){
        return res.status(401).json({ error: "Please authenticate using a valid token", status: "failed" });
    }
}

module.exports = fetchuser;