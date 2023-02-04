const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nome: String,
    cf: String,
    telefono: String,
    email: String,
    sesso: String,
    dataNascita: Date,
    Eta: Number,
    "indice inquinamento ambientale": {
        type: Number,
        min: 0,
        max: 10
    },
    "indice uso alcolici": {
        type: Number,
        min: 0,
        max: 10
    },
    "grado di allergia": {
        type: Number,
        min: 0,
        max: 10,
    },
    "grado di rischio lavorativo": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice dei fattori di rischio familiare": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di malattie croniche": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di alimentazione scorretta": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di obesita": {
        type: Number,
        min: 0,
        max: 10,
    },
    "grado di esposizione a fumo attivo": {
        type: Number,
        min: 0,
        max: 10,
    },
    "grado di esposizione a fumo passivo": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di dolori localizzato": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice emottisi": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice astenia": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di perdita di peso": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice dispnea": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice respiro sibilante": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice disfagia": {
        type: Number,
        min: 0,
        max: 10,
    },
    "stato dita di Ippocrate": {
        type: Number,
        min: 0,
        max: 10,
    },
    "stato di immunodepressione": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice tosse secca": {
        type: Number,
        min: 0,
        max: 10,
    },
    "indice di russamento": {
        type: Number,
        min: 0,
        max: 10,
    },
    priorita: {
        type: String,
        enum: ['Alta','Media','Bassa','None'],
        default: 'None'
    }
});

module.exports = mongoose.model("PazientiSistema",schema);