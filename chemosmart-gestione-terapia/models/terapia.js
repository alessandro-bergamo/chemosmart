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
    },
    numAppuntamenti: {
        type: Number,
        require: true
    },
    frequenzaAppuntamenti: {
        type: Number,
        require: true
    },
    stato: {
        type: String,
        require: true,
        enum: ['In corso', 'Terminata']
    }
}, {timestamps: true})

const Terapia = mongoose.model("Terapia",terapiaSchema)
module.exports = Terapia