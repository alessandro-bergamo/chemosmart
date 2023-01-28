const mongoose = require('mongoose')
const terapiaSchema = mongoose.Schema({
    farmaco: {
        type: String,
        require: true
    },
    dataInizio: {
        type: Number,
        require: true
    },
    frequenzaAppuntamenti: {
        type: Number,
        require: true
    },
    cfPaziente: {
        type: String,
        require: true
    }
})

const Terapia = mongoose.model("Terapia",terapiaSchema)
module.exports = Terapia