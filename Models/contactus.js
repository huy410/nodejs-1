const mongoose = require('mongoose');
const ContactUsSchema = new mongoose.Schema({
    name : String,
    comment:String,
    email:String
});
module.exports = mongoose.model("ContactUs",ContactUsSchema)