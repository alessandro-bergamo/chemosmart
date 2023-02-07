const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nome: String,
    cognome: String,
    cf: String,
    sesso: String,
    dataNascita: Date,
    eta: Number,
    telefono: String,
    email: String,
    indice_inquinamento_ambientale: {
        type: Number,
        min: 0,
        max: 10
    },
    indice_uso_alcolici: {
        type: Number,
        min: 0,
        max: 10
    },
    grado_allergia: {
        type: Number,
        min: 0,
        max: 10,
    },
    grado_rischio_lavorativo: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_fattori_rischio_familiare: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_malattie_croniche: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_alimentazione_scorretta: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_obesita: {
        type: Number,
        min: 0,
        max: 10,
    },
    grado_esposizione_fumo_attivo: {
        type: Number,
        min: 0,
        max: 10,
    },
    grado_esposizione_fumo_passivo: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_dolori_localizzati: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_emottisi: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_astenia: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_perdita_peso: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_dispnea: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_respiro_sibilante: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_disfagia: {
        type: Number,
        min: 0,
        max: 10,
    },
    stato_dita_di_Ippocrate: {
        type: Number,
        min: 0,
        max: 10,
    },
    stato_immunodepressione: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_tosse_secca: {
        type: Number,
        min: 0,
        max: 10,
    },
    indice_russamento: {
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

const Paziente = mongoose.model("PazientiSistema",schema);
module.exports = Paziente