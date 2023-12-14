const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
const register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await user.findOne({_id:verifyUser._id});
        console.log(user);
        
    } catch(error){
        res.status(401).send(error);
    }
}