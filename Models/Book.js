const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name : String,
    price:String,
    describe:String,
    date:String,
    image:String,
    file:String,
    categoryId:String,
    quanlity:String,
    author:String
});
module.exports = mongoose.model("Book",bookSchema)