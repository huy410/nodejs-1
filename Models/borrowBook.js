const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BorrowSchema = new Schema({
    email:String,
    name:String,
    address:String,
    phonenumber:String,
    StartDate:String,
    EndDate:String
})
module.exports = mongoose.model('Borrow', BorrowSchema);