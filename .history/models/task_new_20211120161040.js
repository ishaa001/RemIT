const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    // projname: {
    //     type: String,
    //     unique: false
    // },
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