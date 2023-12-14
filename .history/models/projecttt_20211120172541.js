const mongoose = require("mongoose")
const projSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('taskk',taskSchema)