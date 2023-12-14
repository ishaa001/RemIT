const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        console.log(`Got token ${token}`);
        console.log(`Got secret key ${process.env.SECRET_KEY}`)
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log("Verified user is " + JSON.stringify(verifyUser));

        // const user = await user.findOne({_id:verifyUser._id});
        // console.log("Found user: " + user);
        // next();
    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;