const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:admin@remit.c7bmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`Connection Successful`);
})