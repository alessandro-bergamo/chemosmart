const Paziente = require('../models/paziente.js')

//controller per inserire un paziente
exports.insertPaziente = async(req, res) => {
    const paziente = new Paziente(req.body)

    try {
        await paziente.save()
        res.status(201).json(paziente)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

//controller per restituire tutti i pazienti
exports.getAllPazienti = async (req,res) => {
    try {
        const pazienti = await Paziente.find()
        res.status(200).json(pazienti)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per restituire un paziente in base all'id
exports.getPazienteById = async(req,res) => {
    const CF = req.params.id
    console.log("pene"+ CF)
    console.log(req.body)
    try{
       const paziente = await Paziente.findById(id)
       res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//controller per cancellare un paziente in base all'id
exports.deletePaziente = async(req,res) => {
    const id = req.params.id

    try {
        await Paziente.findByIdAndDelete(id)
        res.json({message : 'Paziente eliminato con successo'})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//controller per aggiornare un paziente in base all'id
exports.updatePaziente = async(req,res) => {
    const id = req.params.id
    const data = {...req.body}
    console.log(req.body)

    try {
        const paziente = await Paziente.findByIdAndUpdate(id, data, {new:true})
        res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

exports.getPazienteFilter = async(req,res) => {
    const nomeQuery = req.query.nome ? req.query.nome : ""
    const cognomeQuery = req.query.cognome ? req.query.cognome : ""
    const cfQyery = req.query.cf ? req.query.cf : ""
    const dataNascitaQuery = req.query.dataNascita ? req.query.dataNascita : ""

    console.log(dataNascitaQuery);
    console.log(req.body)
    try{
        // const $regex = escapeStringRegexp(nomeQuery);
        const paziente = await Paziente.find({ nome: { $regex: nomeQuery }, cognome: {$regex: cognomeQuery}, cf: {$regex: cfQyery}, /*dataNascita: { $lt: date }*/ }).exec()
       res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}
