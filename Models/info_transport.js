const mongoose = require('mongoose');
const transportSchema = new mongoose.Schema({
    fullname : String,
    address:String,
    phoneNumber:String,
    email:String
});
module.exports = mongoose.model("transport",transportSchema)