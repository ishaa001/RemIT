const mongoose = require("mongoose")
const projSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    usr: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    }],
    individuals:{
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('projectt',projSchema)