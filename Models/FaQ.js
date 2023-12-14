const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
    name : String,
    describe:String
});
module.exports = mongoose.model("FaQ",faqSchema)