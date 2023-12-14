const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        console.log(`Got token ${token}`);
        console.log(`Got secret key ${process.env.SECRET_KEY}`)
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY,(err,decode) => {
            if(err){
                console.log("Oops, error!!:( -- " + err);
            }
            else{
                console.log("Got verify return -- " + decode.firstname);
            }
        });
        console.log("Verified user is " + verifyUser );

        // const user = await user.findOne({_id:verifyUser._id});
        // console.log("Found user: " + user);
        // next();
    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;