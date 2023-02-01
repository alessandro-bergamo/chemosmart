const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nome: String,
    cf: String,
    telefono: String,
    email: String,
    sesso: String,
    dataNascita: Date
});

module.exports = mongoose.model("PazientiSistema",schema);