const Farmaco = require('../models/farmaco.js')


/* blocco di codice utile se lavoriamo su json e non su db direttamente
const { v4 : uuidv4 } = require('uuid') 

let farmaci = [] era per provare senza db*/

//controller per inserire farmaci 
exports.insertFarmaco = async (req, res) => {
    const farmaco = new Farmaco(req.body)

    try {
        await farmaco.save()
        res.status(201).json(farmaco)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
    /* const farmacoConId = {...farmaco, id: uuidv4()} // questo nel caso puo tornare utile se lavoriamo direttamente con json e non su db

    farmaci.push(farmacoConId)

    res.send(`Farmaco con nome ${farmaco.nome} inserito`) */
}

//controller per restituire tutti i farmaci
exports.getAllFarmaci = async (req, res) => {

    try {
        const farmaci = await Farmaco.find()
        res.status(200).json(farmaci)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per restituire un farmaco in base all'id
exports.getFarmacoById = async (req, res) => {
    const id = req.params.id

    try {
        const farmaco = await Farmaco.findById(id)
        res.status(200).json(farmaco)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    /*blocco di codice utile se lavoriamo su json e non su db direttamente
     const id = req.params.id
    const farmacoToFind = farmaci.find( (farmaco) => farmaco.id == id)
    res.send(farmacoToFind) */
}



/* //controller per restituire i farmaci in base al nome
exports.getFarmacoByNome = async (req,res) =>{
    const nome = req.params.nome
    
    try {
        const farmaco = await Farmaco.find({nome:nome})
        res.status(200).json(farmaco)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
} */


//controller per eliminare un farmaco in base all'id
exports.deleteFarmaco = async (req, res) => {
    const id = req.params.id

    try {
        await Farmaco.findByIdAndDelete(id)
        res.json({ message: 'Farmaco eliminato con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//controller per aggiornare un farmaco in base all'id
exports.updateFarmaco = async (req, res) => {
    const id = req.params.id
    const data = { ...req.body }
    console.log(req.body)
    try {
        const farmaco = await Farmaco.findByIdAndUpdate(id, data, {new:true}) //new ture serve per restituire effetivamente il json aggiornato
        res.status(200).json(farmaco)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getFarmacoByNome = async (req,res) => {
    const nome = req.params.nome

    try{
        const farmaco = await Farmaco.findOne({nome: {$regex: new RegExp("^" + nome.toLowerCase(), "i")}}).exec()

        res.status(200).json(farmaco)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}