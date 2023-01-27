const mongoose = require('mongoose')

const farmacoSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    descrizione: {
        type: String,
        require: true
    },
    dose: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    }
}, {timestamps: true})  //questo gestitsce i campi createdAt e updateAt automticamente

const Farmaco = mongoose.model('Farmaco',farmacoSchema)

