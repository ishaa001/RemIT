const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    
})

module.exports = mongoose.model('project',projectSchema);
