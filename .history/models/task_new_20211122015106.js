const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    projid: {
        type: String,
        default: "6198ea1e08912f925bbe780d"
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