const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    data: Date,
    ora: String,
    paziente: String
});

module.exports = mongoose.model("Appuntamento",schema);