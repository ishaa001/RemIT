const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema({
    proj_id:{
        type:String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },

})

module.exports = mongoose.model('projects',projectSchema);
