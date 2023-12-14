const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
const register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        console.log(`Got se`)
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log("Verified user is " + verifyUser );

        const user = await user.findOne({_id:verifyUser._id});
        console.log("Found user: " + user);
        next();
    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;