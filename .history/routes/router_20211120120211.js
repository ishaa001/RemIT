const express=require('express');
const route=express.Router();

var controller=require("../controllers/controller");
const services=require("../services/render");

route.get('/',services.homeRoutes);