const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    totalquantity: String,
    totalprice: String,
    booksId: String,
    bookName:String,
    bookImg:String
})
module.exports = mongoose.model('cart', CartSchema);