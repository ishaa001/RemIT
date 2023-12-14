const mongoose = require("mongoose")
const projSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('taskk',taskSchema)