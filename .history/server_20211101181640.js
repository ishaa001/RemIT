const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

const PORT = process.env.PORT || 3000;

//------------ DB Configuration ------------//
// const db = require('./config/key').MongoURI;
require()

app.get('/',function(req,res){
    res.send("Hello world!!")
});

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));