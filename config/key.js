const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:admin@remit.c7bmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection Successful`);
}).catch((e) => {
    console.log(`got error: ${e} :(`)
})