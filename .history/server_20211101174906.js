const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { servicedirectory } = require('googleapis/build/src/apis/servicedirectory');

const PORT = process.env.PORT || 3000;

servicedirectory.