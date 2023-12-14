const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const app = express();
const ejs = require("ejs");
const PORT = process.env.PORT || 3000;

//------------ DB Configuration ------------//
require('./config/key')
const user = require("./models/registers")

const static_path = path.join(__dirname,"./public")
const template_path = path.join(__dirname,"./templates/views")
app.use(express.static(static_path))
app.set("view engine","ejs")

app.set("views",template_path)

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/',function(req,res){
    res.render("index")
});

app.get('/register',function(req,res){
    res.render("register")
});

app.post('/register',async(req,res) => {
    try{
        const password = req.body.password;
        const cpwd = req.body.confirmpassword;
        if(password === cpwd){
            const newUser = new user({
                
            })
        }else{
            res.send("Passwords are not matching!!");
        }
    }catch(error){
        res.status(400).send(error);
    }
})

app.get('/login',function(req,res){
    res.render("login")
});

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));