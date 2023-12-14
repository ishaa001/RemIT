const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

const PORT = process.env.PORT || 3000;

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.get('/',function(req,res){
    res.write("Hello world!!")
});

app.listen(PORT,console.log(`Server running on PORT ${PORT}`));