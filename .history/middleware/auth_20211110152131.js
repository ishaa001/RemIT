const jwt = require("jsonwebtoken");
const register = require("../models/registers");


const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
    } catch(error){
        res.status(401).send(error);
    }
}