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
    data: {
        type: Date,
        require: true
    }
}, {timestamps: true})

const Appuntamento = mongoose.model("Appuntamento",appuntamentoSchema)
module.exports = Appuntamento