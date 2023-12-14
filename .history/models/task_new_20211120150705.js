const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('user',userSchema)