const user = require("../models/registers");
const tasks = require("../models/task_new");
const projs = require("../models/projecttt");
const { UserRefreshClient } = require('google-auth-library');
const { find } = require('../models/registers');
const { exit } = require('process');
var nodemailer = require('nodemailer')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs')
const ejs = require("ejs");
const crypto = require("crypto");



exports.indexRoutes = (req, res) =>{
    res.render('indexx');
}

exports.pomodoroRoutes = (req, res) =>{
    res.render('pomodoro');
}

exports.dashboardRoutes=(req, res) => {
    console.log("Reached at dashboard!!");
    console.log("I got cookies: " + req.cookies.jwt + "\n first name is " + req.user.firstname);
    projs.find({ usr: req.user }, function (err, data) {
        if (data) {
            console.log("Got proj data " + data);
            res.render("sidebars", {
                'user': req.user,
                'projects': data
            });
        }
    })
}

exports.deleteProjectRoutes=async(req, res) => {
    
    const id = req.params.id;
    var proj = await projs.findById({_id:id});
    var projname = proj.name;
    console.log("----------Reached here to delete project: " + projname + "--------")
    //delete task of that particular project
    var proj_tasks = await tasks.deleteMany({projname: projname});
    console.log("Tasks of project " + projname + " deleted successfully!!")

    //delete project
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
}

exports.fetchTasksRoutes=async (req, res) => {
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
            console.log("Got collab " + collabbs.length)
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
}

exports.tasksRoutes=async function (req, res) {
    var tks = await tasks.find({ usr: req.user._id, status: "Pending" });
    res.render("tasks", {
        'user': req.user,
        'tasks': tks,
    });
}

exports.deleteTasksRoutes=(req, res) => {
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
}

exports.completedTasksRoutes=(req, res) => {
    const check = req.body.checkbox;
    var date=new Date();
    console.log("yoooo " + check);
    tasks.findById(check).then(data => {
        if (data) {
            console.log("data recieved : " + data);
            if (data.status == "Pending") {
                data.status = "Completed";
                data.completeTime=date;
                console.log("data changed : " + data);
            }
            else {
                data.status = "Pending"
                console.log("data changed : " + data);
            }
            data.save();
            res.redirect("completed_tasks");
        }
        else {
            res.status(404).send({ message: "Cannot delete with id: ${check}" });
        }
    })

}

exports.createdTasksRoutes=async (req, res) => {
    try {
        console.log("Reached to create tasks!!");
        console.log("Got task " + req.body.name + " and " + req.body.deadline);
        const new_task = new tasks({
            taskname: req.body.name,
            taskDate: req.body.deadline,
            priority: req.body.priority,
            usr: req.user._id,
            projname: req.body.project,
            completeTime:"",
        });
        console.log("Going to save!! --- " + new_task);
        await new_task.save();
        console.log("Task added successfully!!");
        res.status(200).redirect("fetch_task");
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
}

exports.inboxRoutes=async (req, res) => {
    res.redirect("tasks");
}

var end1 = new Date();
end1.setHours(23, 59, 59, 999);
exports.upcomingRoutes=async (req, res) => {
    try {
        console.log("Reached to upcoming task!!");
        // res.render("tasks")
        tasks.find({ taskDate: { $gt: end1 }, usr: req.user,status: "Pending"}, function (err, data) {
            if (data) {
                console.log("Upcoming Data " + data);
                
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': '',
                    'project_name': 'Upcoming'

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
}

exports.completedRoutes=(req, res) => {
    try {
        console.log("Reached to completed task!!");
        // res.render("tasks")
        tasks.find({ status: "Completed", usr: req.user }, function (err, data) {
            if (data) {
                console.log("Completed Data " + data);
                res.render("completed_tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': '',
                    'project_name': 'Completed'

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
}

var start = new Date();
start.setHours(0, 0, 0, 0);

var end = new Date();
end.setHours(23, 59, 59, 999);

exports.todayRoutes=async (req, res) => {
    try {
        console.log("Reached to todays task!!");
        tasks.find({ taskDate: { $gte: start, $lt: end }, usr: req.user, status: "Pending" }, function (err, data) {
            if (data) {
                console.log("Todays Data " + data);
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': '',
                    'project_name': 'Today'
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
}

exports.generalRoutes=async (req, res) => {
    try {
        console.log("Reached to General task!!");
        tasks.find({ projname: "general", usr: req.user, status:"Pending" }, function (err, data) {
            if (data) {
                console.log("General Task " + data);
                res.render("tasks", {
                    'user': req.user,
                    'tasks': data,
                    'projects': '',
                    'project_name': 'General'
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
}

exports.addProjectsRoutes=async (req, res) => {
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
}

exports.inviteMembersRoutes=async (req, res) => {
    try {
        console.log("Reached to invite members!!");
        console.log("Got project " + req.body.name + " and got member " + req.body.email);

        let findUser = await user.findOne({email:req.body.email})
        

        if(findUser != null){
            // res.status(200).send("Invitation send to " + findUser.email);
            inviteThroughMail(req.user.email,findUser,req.body.name)
            res.render("email_sent",{
                'user':req.user,
                'project':req.body.name,
                'email':findUser.email
            })
        }
        else{
            res.send('No such user:(');
        }
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
}

function inviteThroughMail(from,mail,group)
{
    console.log("Our recipients are " + mail.email)
    var mailOptions = {
        from: 'sanjupoptani17@gmail.com',
        to: mail.email,
        subject: 'Invite request for RemIt group ' + group,
        text: 'You have been invited to join group ' + group + ' by ' + from,
        html:'<p> In order to be a member of a group, if you want to accept then click on accept button or else ignore this mail.</p><br><form action="https://remit-siskv.herokuapp.com/accepted_req" method="POST"><input type="hidden" value="' + group + '" name="group"><input type="hidden" value="' + mail + '" name="friend"><input type="submit" value="Accept"></form>'   }

    transport.sendMail(mailOptions,function(err,data){
        if(err){
            console.log("Error :( ?? - " + err)
        }
        else{
            console.log("Email sent successfully!!!" + data.response)
        }
    })
}

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    secure: true,
    text: 'Invitation to RemIt group: ',
    tls: {
        rejectUnauthorized: false
    }

})

exports.acceptedReqRoutes =async(req,res) => {
    // console.log("Trying to print auth" + auth);
    proj = req.app.get('proj')
    console.log("---------------------------------------Reached to accept request!! and got proj" + proj);
    var add_user = await projs.findOneAndUpdate({name:proj},
    {$push:
        {
            usr:req.user
        }
    })
    var updd = await projs.findOneAndUpdate({name:proj},{individuals:false});
    console.log("------------------User added successfully----------------------")
    res.redirect("fetch_task")
}

exports.acceptreqRoutes=async(req,res) => {
    // console.log("Trying to print auth" + auth);
    console.log("Reached to accept request!!");
    console.log("Got project: " + req.body.group + " and user who accepted the request: " + req.user.username)
    alert("Congratulations!! You are now a member of group " + req.body.group);
    res.redirect("fetch_task")
}

exports.logoutRoutes=async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("logout successfully");
        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.registerRoutes=function (req, res) {
    res.render("register")
}

exports.registerAuthRoutes=async (req, res) => {
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
                expires: new Date(Date.now() + 5000000000000),
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
}

exports.loginRoutes=async (req, res) => {
    try {

        const username = req.body.username;
        const pwd = req.body.password;

        const uname = await user.findOne({ username });
        const isPwdMatch = await bcrypt.compare(pwd, uname.password);

        const token = await uname.generateAuthToken();
        console.log("The token part is " + token);

        const cookie = res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000000000),
            httpOnly: true
        });
        console.log("Browser cookie is " + cookie);
        // console.log("Cookies got in login is " + req.cookies.jwt);
        if (isPwdMatch) {
            console.log("Going to dashboard!!");
            let proj = req.body.from_mail
            if(proj != undefined){
                alert("Congratulations!! You are now a member of group " + proj);
                req.app.set('proj', proj)
                res.redirect("accepted_req");
            }
            else{
                res.redirect("fetch_task")
            }
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
        // res.status(400).send("Invalid login details!!, email or cookie problem");
        alert("Invalid login details!!, email or cookie problem")
        res.redirect("login");
    }
}

exports.loginRoute=function (req, res) {
    res.render("login")
}

exports.profileRoutes=async (req, res) => {
    try {
        res.render("profile", { "user": req.user });
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
}

exports.fetchProjectsTaskRoutes=async (req, res) => {
    try {
        let tks = await tasks.find({ projname: req.params.name });
        // console.log("got task  - " + tks + " proj name " + tks.length + req.params.name);
        // let proj_task = [];
        // if(tks.length != 0){
        //     proj_task.push(tks);
        // }
        var projects = await projs.find({name:req.params.name});
        console.log("Project is -----------------: " + projects + " and users are ----------------: " + projects[0].usr)
        var user_nms = [];
        console.log("Got user details")
        for(var i = 0;i < projects.length;i++){
            var userID = projects[i].usr;
            if(projects[i].individuals == false){
                console.log("-----------------Got user id: " + userID + "------------")
                console.log("---------------- type of user id " + typeof(userID));
                // var o_id = mongoose.Types.ObjectId(userID)
                const exists = await user.find({"_id":userID});
                if(!exists){
                    console.log("Got error:( ------------------" + exists.username);
                }
                else{
                    console.log("Successful----------------- " + exists.username);
                }
                for(var j = 0;j < exists.length;j++){
                    user_nms.push(exists[j].username);
                }
            }
        }

        console.log("Got users: " + user_nms);

        res.render("project_wise_task", {
            'user': req.user,
            'project_tasks': tks,
            'proj_name': req.params.name,
            'proj_users': user_nms
        });
    }
    catch (error) {
        res.status(400).send("Oops error: " + error);
    }
}

exports.priorityTaskRoutes =async (req, res) => {
    try {
        var priority = req.params.priority;
        console.log("Reached in priority task fetching - " + priority)
        if (priority == 'medium'){
            priority = "mid"
        }
        let priority_based_task = await tasks.find({ priority: priority, status: "Pending", usr: req.user });
        if (priority == 'high') {
            priority = 'High'
        }
        else if (priority == 'low') {
            priority = 'Low'
        }
        else if(priority =='mid'){
            priority = 'Medium'
        }
        res.render("priority_wise_task", {
            'user': req.user,
            'project_tasks': priority_based_task,
            'priorities': priority
        });
    }
    catch (err) {
        console.log("Oops error:( " + err);
    }
}

exports.deleteProjectsRoutes =async (req, res) => {
    console.log("-------------Reached inside delete project------------")
    const id = req.params.id;
    var proj = await projs.findById({ _id: id });
    var projname = proj.name;
    console.log("----------Reached here to delete project: " + projname + "--------")
    //delete task of that particular project
    if (proj.individuals == true) {
        console.log("Reached here in individuals --------------------")
        var proj_tasks = await tasks.deleteMany({ projname: projname });
        console.log("Tasks of project " + projname + " deleted successfully!!")

        //delete project
        projs.findByIdAndDelete(id).then(data => {
            if (data) {
                console.log("I got " + data + " to delete");
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
    }
    else if (proj.individuals == false) {
        console.log("Reached here in group--------------------")
        var userId = req.user._id;
        console.log("User id is " + userId);
        console.log("Users in project before are -------------------- " + proj.usr)
        proj.usr.pull(userId)
        proj.save()
        console.log("Users in project are -------------------- " + proj.usr)
        if(proj.usr.length <= 1){
            proj.individuals = true
        }
        res.redirect("/fetch_task")
        // res.send("Request got OK")
    }
}

exports.completedTRoutes=function (req, res) {
    res.redirect("completed")
}