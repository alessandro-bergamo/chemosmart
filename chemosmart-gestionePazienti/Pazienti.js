const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nome: String,
    cognome: String,
    eta: String,
    email: String,
    telefono: String
});

module.exports = mongoose.model("PazientiSistema",schema);