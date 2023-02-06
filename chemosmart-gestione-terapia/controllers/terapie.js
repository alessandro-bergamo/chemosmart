const Terapia = require('../models/terapia.js')


//controller per inserire terapia
exports.insertTerapia = async (req, res) => {
    const terapia = new Terapia(req.body)

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
    console.log(req.body)
    try {
        const terapia = await Terapia.findByIdAndUpdate(id, data, {new:true}) //new ture serve per restituire effetivamente il json aggiornato
        res.status(200).json(terapia)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}