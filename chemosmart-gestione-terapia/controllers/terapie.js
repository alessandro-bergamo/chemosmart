const Terapia = require('../models/terapia.js')


//controller per inserire terapia
exports.insertTerapia = async (req, res) => {
    const terapia = new Terapia(req.body)

    if(!req.body.cfPaziente || !req.body.farmaco || !req.body.dataInizio || !req.body.numAppuntamenti || !req.body.frequenzaAppuntamenti || !req.body.stato){
        res.status(400).json("Non sono stati trovati uno o più parametri")
    }

    const codiceFiscaleRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/
    if(!codiceFiscaleRegex.test(req.body.cfPaziente)){
        res.status(400).json("Codice Fiscale non è nel formato corretto")
    }

    const farmacoRegex = /^[\w\s\u00AD\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]+$/u
    if(!farmacoRegex.test(req.body.farmaco)){
        res.status(400).json("Il farmaco non è nel formato corretto")
    }

    const dataInizioRegex = /^(\d{3}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\+00:00Z)$/
    if(!dataInizioRegex.test(req.body.dataInizio)){
        res.status(400).json("La data non è nel formato corretto")
    }

    if(req.body.numAppuntamenti <= 0){
        res.status(400).json("Il numero di appuntamenti è inferiore o uguale a 0")
    }

    if(!req.body.frequenzaAppuntamenti == 7 || !req.body.frequenzaAppuntamenti == 14 || !req.body.frequenzaAppuntamenti == 21 ){
        res.status(400).json("La frequenza degli appuntamenti non è nel formato numerico che può essere scelto")
    }

    try {
        await terapia.save()
        res.status(201).json(terapia)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

//controller per restituire tutte le terapie
exports.getAllTerapie = async (req, res) => {

    try {
        const terapie = await Terapia.find()
        res.status(200).json(terapie)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per restituire una terapia in base all'id
exports.getTerapiaById = async (req, res) => {
    const id = req.params.id

    try {
        const terapia = await Terapia.findById(id)
        res.status(200).json(terapia)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per eliminare una terapia in base all'id
exports.deleteTerapia = async (req, res) => {
    const id = req.params.id

    try {
        await Terapia.findByIdAndDelete(id)
        res.json({ message: 'Terapia eliminata con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//controller per aggiornare una terapia in base all'id
exports.updateTerapia = async (req, res) => {
    const id = req.params.id
    const data = { ...req.body }
    console.log('ho ricevuto come parametri', req.body)
    try {
        const terapia = await Terapia.findByIdAndUpdate(id, data, {new:true}) //new ture serve per restituire effetivamente il json aggiornato
        res.status(200).json(terapia)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per ricercare una terapia per CF del paziente
exports.getTerapiaFilter = async(req,res) => {
    const cfQuery = req.query.cf ? req.query.cf : ""
    try{
        // const $regex = escapeStringRegexp(nomeQuery);
        const terapia = await Terapia.find({cfPaziente: { $regex: new RegExp(`^${cfQuery.toLowerCase()}`, 'i')}}).exec();
        
       res.status(200).json(terapia)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}