const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    projname: {
        type: String,
        default: "wth"
    },
    taskDate: {
        type: Date
    },
    priority: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    usr: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('taskk',taskSchema)