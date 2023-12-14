const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName : String,
    lastName:String,
    userName:String,
    age:String,
    email:String,
    address:String,
    phoneNumber:String,
    password:String,
    dateofbirth:String
});
module.exports = mongoose.model("User",userSchema)