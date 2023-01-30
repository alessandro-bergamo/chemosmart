const mongoose = require('mongoose')
const terapiaSchema = mongoose.Schema({
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
    frequenzaAppuntamenti: {
        type: Number,
        require: true
    }
}, {timestamps: true})

const Terapia = mongoose.model("Terapia",terapiaSchema)
module.exports = Terapia