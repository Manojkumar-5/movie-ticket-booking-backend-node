const mongoose=require("mongoose");

mongoose.connect('mongodb+srv://admin:admin@cluster0.vq9op.mongodb.net/movieticket?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true},(err) => {
    if(!err)
    console.log("database connected succesfully");
})

module.exports = mongoose;