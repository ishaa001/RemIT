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
alert = require('alert');

//------------ DB Configuration ------------//
require('./config/key')
const user = require("./models/registers");
const tasks = require("./models/task_new");
const projs = require("./models/projecttt");
const { UserRefreshClient } = require('google-auth-library');

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")
app.use(express.static(static_path))
app.set("view engine", "ejs")
app.set("views", template_path)

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.render("indexx")
});

app.get('/pomodoro', function (req, res) {
    res.render("pomodoro")
});


app.get('/dashboard', auth, (req, res) => {
    // console.log("Reached in index");
    console.log("Reached at dashboard!!");
    console.log("I got cookies: " + req.cookies.jwt + "\n first name is " + req.user.firstname);
    // res.render("sidebars",{"projects":req.projects});
    // res.render("sidebars",{'user':req.user});
    projs.find({ usr: req.user }, function (err, data) {
        if (data) {
            console.log("Got proj data " + data);
            res.render("sidebars", {
                'user': req.user,
                'projects': data
            });
        }
    })
})
app.get('/del_projects/:id', auth, (req, res) => {
    const id = req.params.id;
    projs.findByIdAndDelete(id).then(data => {
        if (data) {
            console.log("I got " + data + " to delete");
            // res.send({
            //     message: "Project deleted successfully"
            // });
            res.redirect("/fetch_task");
        }
        else {
            res.status(404).send({ message: "Cannot delete with id: ${id}" });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete becoz " + err
            });
        })
})



app.get('/fetch_task', auth, async (req, res) => {
    try {
        // var tks = await tasks.find({ usr: req.user });
        let rem_projs = await projs.find({ usr: req.user, individuals: true });
        let collabbs = await projs.find({ usr: req.user, individuals: false });
        console.log("got rem_projs - " + rem_projs + " and rem_projs.length " + rem_projs.length);
        console.log("got collabbs - " + collabbs + " and collabbs.length " + collabbs.length);
        if (rem_projs.length != 0 && collabbs.length != 0) {
            console.log("got projs - " + rem_projs);
            console.log("Length is " + rem_projs.length + " and 0th proj is " + rem_projs[0].name);
            res.render("sidebars", {
                'user': req.user,
                'projects': rem_projs,
                'collab': collabbs
            });
        }
        else if (rem_projs.length != 0) {
            res.render("sidebars", {
                'user': req.user,
                'projects': rem_projs,
                'collab': ''
            });
        }
        else if (collabbs.length != 0) {
            res.render("sidebars", {
                'user': req.user,
                'projects': '',
                'collab': collabbs
            })
        }
        else {
            res.render("sidebars", {
                'user': req.user,
                'projects': '',
                'tasks': ''
            })
        }
    }
    catch (err) {
        console.log("Oops, some error:( -- " + err);
    }
})
app.get('/tasks', auth, async function (req, res) {
    var tks = await tasks.find({ usr: req.user._id, status: "Pending" });
    res.render("tasks", {
        'user': req.user,
        'tasks': tks,
    });
});

app.get('/del_tasks/:id', auth, (req, res) => {
    const id = req.params.id;
    tasks.findByIdAndDelete(id).then(data => {
        if (data) {
            console.log("I got " + data + " to delete");
            // res.send({
            //     message: "Task deleted successfully"
            // });
            res.redirect("/tasks");
        }
        else {
            res.status(404).send({ message: "Cannot delete with id: ${id}" });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete becoz " + err
            });
        })
})

app.post('/completed_tasks', auth, (req, res) => {
    const check = req.body.checkbox;
    console.log("yoooo " + check);
    tasks.findById(check).then(data => {
        if (data) {
            console.log("data recieved : " + data);
            if (data.status == "Pending") {
                data.status = "Completed";
                console.log("data changed : " + data);
            }
            else {
                data.status = "Pending"
                console.log("data changed : " + data);
            }
            data.save();
            res.redirect("tasks");
        }
        else {
            res.status(404).send({ message: "Cannot delete with id: ${check}" });
        }
    })

})

app.post('/create_tasks', auth, async (req, res) => {
    try {
        console.log("Reached to create tasks!!");
        console.log("Got task " + req.body.name + " and " + req.body.deadline);
        const new_task = new tasks({
            taskname: req.body.name,
            taskDate: req.body.deadline,
            priority: req.body.priority,
            usr: req.user._id,
            projname: req.body.project
        });
        console.log("Going to save!! --- " + new_task);
        await new_task.save();
        console.log("Task added successfully!!");
        res.status(200).redirect("fetch_task");
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})

app.get('/inbox', auth, async (req, res) => {
    res.redirect("tasks");
})

app.get('/upcoming', auth, async (req, res) => {
    try {
        console.log("Reached to upcoming task!!");
        // res.render("tasks")
        tasks.find({ taskDate: { $gte: new Date() }, usr: req.user }, function (err, data) {
            if (data) {
                console.log("Upcoming Data " + data);
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': ''
                });
            }
            else {
                console.log("Again error:(" + err);
            }
        })
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})

app.get('/completed', auth, (req, res) => {
    try {
        console.log("Reached to completed task!!");
        // res.render("tasks")
        tasks.find({ status: "Completed", usr: req.user }, function (err, data) {
            if (data) {
                console.log("Completed Data " + data);
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': ''
                });
            }
            else {
                console.log("Again error:(" + err);
            }
        })
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})


var start = new Date();
start.setHours(0, 0, 0, 0);

var end = new Date();
end.setHours(23, 59, 59, 999);

app.get('/today', auth, async (req, res) => {
    try {
        console.log("Reached to todays task!!");
        tasks.find({ taskDate: { $gte: start, $lt: end }, usr: req.user }, function (err, data) {
            if (data) {
                console.log("Todays Data " + data);
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': ''
                });
            }
            else {
                console.log("Again error:(" + err);
            }
        })
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})

app.post('/add_projects', auth, async (req, res) => {
    try {
        console.log("Reached to create projects!!");
        console.log("Got project " + req.body.name);
        const new_task = new projs({
            name: req.body.name,
            usr: req.user
        });
        console.log("Going to save!! --- " + new_task);
        await new_task.save();
        console.log("Projs added successfully!!");
        res.status(200).redirect("fetch_task");
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
});

app.post('/invite_members', auth, async (req, res) => {
    try {
        console.log("Reached to invite members!!");
        console.log("Got project " + req.body.name + " and got member " + req.body.email);

        user.find({email:req.body.email},function(err,data){
            if(data){
                console.log("Got user: " + data.email + " and data: " + data);
                res.status(200).send("Invitation mail sent to " + data.email + "!");
            }
            else{
                console.log("Error: " + err);
            }
        })

        // const new_task = new projs({
        //     name: req.body.name,
        //     usr: req.user
        // });
        // console.log("Going to save!! --- " + new_task);
        // await new_task.save();
        // console.log("Projs added successfully!!");
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
});

app.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("logout successfully");
        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/register', function (req, res) {
    res.render("register")
});

app.post('/register', async (req, res) => {
    try {
        console.log("Reached here")
        const password = req.body.password;
        const cpwd = req.body.confirmpassword;
        console.log("Got data" + req.body.profile);
        if (password === cpwd) {
            const newUser = new user({
                username: req.body.username,
                email: req.body.email,
                emailToken: crypto.randomBytes(64).toString("hex"),
                isVerified: false,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: password,
                profile: req.body.profile
            });
            // console.log("The success part is " + newUser);
            const token = await newUser.generateAuthToken();
            console.log("The token part is " + token);

            // console.log("Got token: " + newUser.token);
            // const cookie = res.cookie("jwt",token);
            // console.log("cookie is " + cookie)
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgzMDAxODBmMzZlOWU0ZmNlOTVjY2IiLCJpYXQiOjE2MzU5NzUxOTJ9.eowlCXdhUSjgMO0eYlIgwUH9DVfcOeKTqEvmsBTODpA
            const cookie = res.cookie("jwt", token, {
                expires: new Date(Date.now() + 500000),
                httpOnly: true
            });
            // console.log("Browser cookie is " + cookie);

            const registered = await newUser.save();
            res.status(200).redirect("fetch_task")
        } else {
            res.send("Passwords are not matching!!");
        }
    } catch (error) {
        console.log("Errrorrr!!!! " + error);
        res.status(400).send("email or cookie problem");
    }
});


app.post('/login', async (req, res) => {
    try {

        const username = req.body.username;
        const pwd = req.body.password;

        const uname = await user.findOne({ username });
        const isPwdMatch = await bcrypt.compare(pwd, uname.password);

        const token = await uname.generateAuthToken();
        console.log("The token part is " + token);

        const cookie = res.cookie("jwt", token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        });
        console.log("Browser cookie is " + cookie);
        // console.log("Cookies got in login is " + req.cookies.jwt);
        if (isPwdMatch) {
            console.log("Going to dashboard!!");
            res.redirect("fetch_task");
        }
        else {
            // res.send("Invalid login details!!, password doesnt match");
            alert("Invalid Password!")
            res.redirect("login");
        }
        // console.log("Got token: " + uname.token);
        // res.cookie("jwt",token);
        // console.log(cookie)



    } catch (error) {
        res.status(400).send("Invalid login details!!, email or cookie problem");
    }
});

app.get('/login', function (req, res) {
    res.render("login")
});


app.get('/profile', auth, async (req, res) => {
    try {
        res.render("profile", { "user": req.user });
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})

//new added 

app.get('/fetch_project_task/:name', auth, async (req, res) => {
    try {
        let tks = await tasks.find({ usr: req.user._id, projname: req.params.name });
        console.log("got task  - " + tks + " proj name " + tks.length + req.params.name);
        // let proj_task = [];
        // if(tks.length != 0){
        //     proj_task.push(tks);
        // }
        res.render("project_wise_task", {
            'user': req.user,
            'project_tasks': tks,
            'proj_name': req.params.name,
        });
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
})

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));