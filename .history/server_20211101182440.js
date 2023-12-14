const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const app = express();

const PORT = process.env.PORT || 3000;

//------------ DB Configuration ------------//
require('./config/key')

const static_path = path.join(__dirname,"./public")
app.use(express.static(static_path))


app.get('/',function(req,res){
    res.send("Hello world!!")
});

app.listen(PORT,
    console.log(`Server running on PORT ${PORT}`));