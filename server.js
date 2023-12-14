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
alert = require('alert');


//------------ DB Configuration ------------//
require('./config/key')

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")
app.use(express.static(static_path))
app.set("view engine", "ejs")
app.set("views", template_path)

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//load routers 
app.use('/',require('./routes/router'));

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));