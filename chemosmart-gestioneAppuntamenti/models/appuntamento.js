const mongoose = require('mongoose')
const appuntamentoSchema = mongoose.Schema({
    cfPaziente: {
        type: String,
        require: true
    },
    farmaco: {
        type: String,
        require: true
    },
    dataInizio: {
        type: Date,
        require: true
    },
    dataFine: {
        type: Date,
        require: true
    },
    nome: {
        type: String,
        require: true
    },
    cognome: {
        type: String,
        require: true
    }
}, { timestamps: true })

const Appuntamento = mongoose.model("Appuntamento", appuntamentoSchema)
module.exports = Appuntamento