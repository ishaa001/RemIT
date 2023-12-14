const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
})