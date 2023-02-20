const Terapia = require('../models/terapia.js')
const { getPaziente, getFarmaco } = require('../services/apiClient.js')

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
    
    try{
        const terapiaOld = await Terapia.findById(id)

        if(!terapiaOld){
            res.status(400).json("Terapia non trovata")
            return;
        }  

        if(data.numAppuntamenti <= 0){
            res.status(400).json('Numero appuntamenti non valido')
            return;
        }

        if(data.frequenzaAppuntamenti != 7 && data.frequenzaAppuntamenti != 14 && data.frequenzaAppuntamenti != 21){
            res.status(400).json('Frequenza appuntamenti non valida')
            return;
        }

        if(data.stato != 'In corso' && data.stato != 'Non schedulata' && data.stato != 'Terminata'){
            res.status(400).json('Stato della terapia non valido')
            return;
        }
        const response =  await getPaziente(data.cfPaziente)
        const paziente = response.data
        console.log(response)
        console.log(paziente)
        
        if(!paziente){
            console.log('paziente 404')
            res.status(400).json("Paziente non trovato")
            return;
        }
        
        const responseFarmaco = await getFarmaco(data.farmaco)
        const farmaco = responseFarmaco.data

        if(!farmaco){
            console.log('farmaco 404')
            res.status(400).json('Farmaco non valido')
            return;
        }

        try {
            const terapia = await Terapia.findByIdAndUpdate(id, data, {new:true}) //new ture serve per restituire effetivamente il json aggiornato
            res.status(200).json(terapia)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    } catch (error){
        res.status(409).json({ message: error.message })
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