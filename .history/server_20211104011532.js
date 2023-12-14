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
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
            user.register(newUser,async function(err,user){
                if(err){
                    req.flash("error",err.message);
                    return res.redirect("/register")
                }
                const msge = {
                    from: 'noreply@email.com',
                    to: user.email,
                    subject: 'Verify your email',
                    text: `
                    Hello, Thanks for registering on our site.
                    Please copy and paste the address below to verify your account.
                    http://${req.headers.host}/verify-email?token=${user.emailToken}
                    `,
                    html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on our site.</p>
                    <p>Please click the link below to verify your account. </p>
                    <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your account </a>
                    `
                }
                try{
                    await sgMail.send(msge);
                    req.flash('success','Thanks for registering. Please check your email to verify your account.');
                    res.render('index');
                }catch(err){
                    console.log(err);
                    req.flash('error','Something went wrong');
                }
            })
        }else{
            res.send("Passwords are not matching!!");
        }
    }catch(error){
        res.status(400).send(error);
    }
});

app.get('/verify-email',async(req,res,next)=>{
    try{
        const usr = 
    }
})

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