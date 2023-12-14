require('dotenv').config();
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
const crypto = require("crypto");
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3000;
const auth = require("./middleware/auth")

//------------ DB Configuration ------------//
require('./config/key')
const user = require("./models/registers");
const tasks = require("./models/task_new")
const { UserRefreshClient } = require('google-auth-library');

const static_path = path.join(__dirname,"./public")
const template_path = path.join(__dirname,"./templates/views")
app.use(express.static(static_path))
app.set("view engine","ejs")
app.set("views",template_path)

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.get('/',function(req,res){
    res.render("indexx")
});

app.get('/dashboard' , auth ,(req,res) => {
    // console.log("Reached in index");
    console.log("Reached at dashboard!!");
    console.log("I got cookies: " + req.cookies.jwt + "\n first name is " + req.user.firstname);
    // console.log("I got cookies: " + req.cookies.jwt + "and firstname is " + req.firstname);
    // res.render("sidebars",{"projects":req.projects});
    // tasks.find({},function(err,data){
    //     if(data){
    //         console.log("Got data " + data);
    //         res.render("sidebars",{
    //             'user' : req.user,
    //             'tasks' : data
    //         });
    //     }
    //     else{
    //         console.log("Again error:(" + err);
    //     }
    // })
    res.render("sidebars",{'user':req.user});
})

app.get('/fetch_task', auth,(req,res) => {
    tasks.find({},function(err,data){
        if(data){
            console.log("Got data " + data);
            res.render("tasks",{
                'user' : req.user,
                'tasks' : data
            });
        }
        else{
            console.log("Again error:(" + err);
        }
    })
})

app.post('/create_tasks', auth , async(req,res) => {
    try{
        console.log("Reached to create tasks!!");
        console.log("Got task " + req.body.name + " and " + req.body.deadline);
        const new_task = new tasks({
            taskname: req.body.name,
            taskDate: req.body.deadline,
            usr: req.user._id
        });
        console.log("Going to save!! --- " + new_task);
        await new_task.save();
        console.log("Task added successfully!!");
        res.status(200).redirect("dashboard");
    }
    catch(error){
        res.status(400).send("Oops error: " + error);
    }
})

app.post('/add_projects', auth , async(req,res) => {
    try{
        console.log("Reached to create projects!!");
        console.log("Got project " + req.body.name );
        const new_task = new tasks({
            name: req.body.name,
        });
        console.log("Going to save!! --- " + new_task);
        await new_task.save();
        console.log("Task added successfully!!");
        res.status(200).redirect("dashboard");
    }
    catch(error){
        res.status(400).send("Oops error: " + error);
    }
})

app.get("/logout",auth,async(req,res) => {
    try{
        res.clearCookie("jwt");
        console.log("logout successfully");
        await req.user.save();
        res.render("login");
    }catch(error){
        res.status(500).send(error)
    }
})

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
                password: password
            });
            // console.log("The success part is " + newUser);
            const token = await newUser.generateAuthToken();
            console.log("The token part is " + token);
            
            // console.log("Got token: " + newUser.token);
            // const cookie = res.cookie("jwt",token);
            // console.log("cookie is " + cookie)
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgzMDAxODBmMzZlOWU0ZmNlOTVjY2IiLCJpYXQiOjE2MzU5NzUxOTJ9.eowlCXdhUSjgMO0eYlIgwUH9DVfcOeKTqEvmsBTODpA
            const cookie = res.cookie("jwt",token, {
                expires: new Date(Date.now() + 500000),
                httpOnly: true
            });
            // console.log("Browser cookie is " + cookie);

            const registered = await newUser.save();
            res.status(200).redirect("fetch_task")
        }else{
            res.send("Passwords are not matching!!");
        }
    }catch(error){
        console.log("Errrorrr!!!! " + error);
        res.status(400).send("email or cookie problem");
    }
});


app.post('/login',async(req,res)=>{
    try{

        const username = req.body.username;
        const pwd = req.body.password;

        const uname = await user.findOne({username});
        const isPwdMatch = await bcrypt.compare(pwd,uname.password);

        const token = await uname.generateAuthToken();
        console.log("The token part is " + token);

        const cookie = res.cookie("jwt",token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        });
        console.log("Browser cookie is " + cookie);
        // console.log("Cookies got in login is " + req.cookies.jwt);
        if(isPwdMatch){
            console.log("Going to dashboard!!");
            res.redirect("fetch_task");
        }
        else{
            res.send("Invalid login details!!, password doesnt match");
        }
        // console.log("Got token: " + uname.token);
        // res.cookie("jwt",token);
        // console.log(cookie)

        

    }catch(error){
        res.status(400).send("Invalid login details!!, email or cookie problem");
    }
});

app.get('/login',function(req,res){
    res.render("login")
});



app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));