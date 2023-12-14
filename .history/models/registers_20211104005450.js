const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    }
})

userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
})

userSchema.path('email').validate((val) =>{
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid Email')

module.exports = mongoose.model('user',userSchema)