const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
    totalPrice : String,
    totalOrder : String,
});
module.exports = mongoose.model("Bill",billSchema)