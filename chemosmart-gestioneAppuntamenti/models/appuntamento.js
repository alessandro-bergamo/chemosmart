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
    durata: {
        type: Number,
        // min: 1,
        // max: 4,
        require: true
    }
}, {timestamps: true})

const Appuntamento = mongoose.model("Appuntamento",appuntamentoSchema)
module.exports = Appuntamento