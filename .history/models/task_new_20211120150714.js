const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
        unique: true
    },
    projname: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('user',userSchema)