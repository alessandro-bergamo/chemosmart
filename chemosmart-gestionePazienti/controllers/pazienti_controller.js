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
exports.getAllPazienti = (req,res) => {
    const paziente = Paziente.find({})
    .then(pazienti => {
        res.status(200).json(pazienti)
    })
    .catch(error => {
        console.error(error)
        res.status(500).send(error)
    })
}

//controller per restituire un paziente in base all'id
exports.getPazienteByCF = async(req,res) => {
    const CF = req.params.id

    console.log(req.body)
    try{
       const paziente = await Appuntamento.findById(id)
       res.status(200).send(paziente)
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
        res.status(200).json(appuntamento)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}