const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        console.log("Got projects " + req.body.)
        if(token == undefined){
            res.render("login",{'from_mail':true})
        }
        else{
            console.log(`Got token ${token}`);
            console.log(`Got secret key ${process.env.SECRET_KEY}`)
            const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
            console.log("Verified user is " + JSON.stringify(verifyUser._id));
            const userr = await Register.findOne({_id:verifyUser._id});
            // console.log("Found user: " + userr);

            req.token = token;
            req.user = userr;
            next();
        }
        // next();
    } catch(error){
        console.log("Oops, got error:( -- " + error);
        res.status(401).send(error);
    }
}

module.exports = auth;