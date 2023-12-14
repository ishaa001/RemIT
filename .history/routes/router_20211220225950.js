const express=require('express');
const route=express.Router();
const auth = require("../middleware/auth")
const services=require("../services/render");


route.get('/', services.indexRoutes);

route.get('/pomodoro', services.pomodoroRoutes);

route.get('/dashboard',auth,services.dashboardRoutes )

route.get('/del_projects/:id', auth,services.deleteProjectRoutes)

route.get('/fetch_task', auth, services.fetchTasksRoutes)

route.get('/tasks', auth, services.tasksRoutes);

route.get('/del_tasks/:id', auth, services.deleteTasksRoutes)

route.post('/completed_tasks', auth, services.completedTasksRoutes)

route.post('/create_tasks', auth, services.createdTasksRoutes)

route.get('/inbox', auth, services.inboxRoutes)

route.get('/upcoming', auth, services.upcomingRoutes)

route.get('/completed', auth, services.completedRoutes)

route.get('/today', auth, services.todayRoutes)

route.post('/add_projects', auth, services.addProjectsRoutes);

route.post('/invite_members', auth, services.inviteMembersRoutes);

route.get('/accepted_req',auth,services.acceptedReqRoutes);

route.post('/accepted_req',auth,services.acceptreqRoutes)

route.get("/logout", auth, services.logoutRoutes)

route.get('/register',services.registerRoutes);

route.post('/register', services.registerAuthRoutes);

route.post('/login',services.loginRoutes);

route.get('/login', services.loginRoute);

route.get('/profile', auth, services.profileRoutes);

route.get('/fetch_project_task/:name', auth,services.fetchProjectsTaskRoutes);

route.get('/priority_task/:priority', auth,services.priorityTaskRoutes);

route.get('/del_projects/:id', auth,services.deleteProjectsRoutes);

route.get('/completed_tasks', auth,services.completedTRoutes)

module.exports=route