const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const app = express();
const bcrypt = require('bcryptjs')
const ejs = require("ejs");
const sgMail = require('@sendgrid/mail');
const crypto = require("crypto");
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
                username: req.body.username,
                email: req.body.email,
                emailToken: crypto.randomBytes(64).toString("hex"),
                isVerified:false,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: password,
                confirmpassword: cpwd
            });

            const token = await newUser.gene

            const registered = await newUser.save();
            res.status(200).render("index")
        }else{
            res.send("Passwords are not matching!!");
        }
    }catch(error){
        res.status(400).send(error);
    }
});

// app.get('/verify-email',async(req,res,next)=>{
//     try{
//         const usr = await user.findOne({emailToken: req.query.token});
//         if(!usr){
//             req.flash('error','Token is invalid, please try to register again!!');
//             return res.redirect('/');
//         }
//         user.emailToken = null;
//         user.isVerified = true;
//         await user.save();
//         await req.login(user,async(err)=>{
//             if(err){
//                 return next(err);
//             }
//             req.flash('success',`Welcome to RemIt, ${user.username}`)
//             const redirectUrl = req.session.redirectTo || '/';
//             delete req.session.redirectTo;
//             res.redirect(redirectUrl);
//         })
//     }catch(error){
//         console.log(error);
//         req.flash('error','Something went wrong:(');
//         res.redirect('/')
//     }
// })

app.post('/login',async(req,res)=>{
    try{

        const username = req.body.username;
        const pwd = req.body.password;

        const uname = await user.findOne({username});
        const isPwdMatch = await bcrypt.compare(pwd,uname.password);
        if(isPwdMatch){
            res.render("index");
        }
        else{
            res.send("Invalid login details!!");
        }

    }catch(error){
        res.status(400).send("Invalid login details!!");
    }
});

app.get('/login',function(req,res){
    res.render("login")
});

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));