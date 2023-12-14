const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
})