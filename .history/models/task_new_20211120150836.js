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
    },
    taskDate: {
        type: Date
    },
    priority: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('task',userSchema)