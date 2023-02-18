const Appuntamento = require('../models/appuntamento.js')
const {getPaziente, getFarmaco} = require('../services/apiClient')
const axios = require('axios')

//controller per inserire un appuntamento 
exports.insertAppuntamento = async (req, res) => {
    const cf = req.body.cfPaziente
    try{
        const response = await getPaziente(cf)
        const paziente = response.data[0]
        console.log(paziente)
        if(!paziente){
            console.log('non è arrivato nulla')
            res.status(409).json({message: 'errore ricerca paziente'})
        }

        console.log(paziente.nome + ' ' + req.body.nome)
        if(paziente.nome != req.body.nome){
            console.log('nome non valido')
            res.status(400).json({message: 'Nome non valido'})
        }
        console.log(paziente.cognome + ' ' + req.body.cognome)
        if(paziente.cognome != req.body.cognome){
            console.log("cognome no valido")
            res.status(400).json({message: 'Cognome non valido'})
        }

        const dataInizio = new Date(req.body.dataInizio)
        const dataFine = new Date(req.body.dataFine)
        const dataOdierna = new Date()

        if(dataInizio.getTime() < dataOdierna.getTime()){
            console.log('dataInizio non valida')
            res.status(400).json({message: 'DataInizio non valida'})
        }

        if(dataFine.getTime() < dataOdierna.getTime()){
            console.log('dataFine non valida')
            res.status(400).json({message: 'DataFine non valida'})
        }

        if(dataFine.getTime() < dataInizio.getTime()){
            console.log('date non vanno bene')
            res.status(400).json({message: 'Date non valide'})
        }

        const responseFarmaco = await getFarmaco(req.body.farmaco)
        const farmaco = responseFarmaco.data[0]

        if(!farmaco){
            res.status(400).json({message: 'Farmaco non trovato'})
        }

        const appuntamento = new Appuntamento(req.body)
        console.log(appuntamento)
        try {
            await appuntamento.save()
            console.log('salvato\n' + appuntamento)
            res.status(201).json(appuntamento)
        } catch (error) {
            console.log('errore')
            res.status(409).json({ message: error.message })
        }
    }catch(error){
        res.status(409).json({message: error.message})
    }
    
}
//funzione per fromattare correttamente nome e cognome
function formattaParole(parole) {
    // Divido la stringa in due parole usando uno spazio come separatore
    const paroleArray = parole.split(" ");
    // Formatto ogni parola in modo che inizi con la maiuscola e poi abbia tutte le altre lettere in minuscolo
    const paroleFormattate = paroleArray.map(parola => {
        const primaLettera = parola.charAt(0).toUpperCase();
        const restoParola = parola.slice(1).toLowerCase();
        return primaLettera + restoParola;
    });
    // Unisco le parole formattate in una singola stringa separata da uno spazio
    const paroleFormattateStringa = paroleFormattate.join(" ");
    return paroleFormattateStringa;
}


//controller per restituire tutti gli appuntamenti
exports.getAllAppuntamenti = (req, res) => {
    const appuntamento = Appuntamento.find({})
        .then(appuntamenti => {
            const events = [];
            for (const appuntamento of appuntamenti) {
                events.push({
                    title: formattaParole(appuntamento.nome + ' ' + appuntamento.cognome),
                    start: appuntamento.dataInizio,
                    end: appuntamento.dataFine,
                    id: appuntamento._id
                });
            }
            res.send(events);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
}

//controller per restituire un appuntamento  in base all'id
exports.getAppuntamentoById = async (req, res) => {
    const id = req.params.id

    if(!id){
        res.status(400).json()
    }
    try {
        const appuntamento = await Appuntamento.findById(id)
        res.status(200).json(appuntamento)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per eliminare un appuntamento  in base all'id
exports.deleteAppuntamento = async (req, res) => {
    const id = req.params.id

    try {
        await Appuntamento.findByIdAndDelete(id)
        res.json({ message: 'Appuntamento eliminato con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//controller per aggiornare un appuntamento in base all'id
exports.updateAppuntamento = async (req, res) => {
    const id = req.params.id

    
    const data = { ...req.body }

    try {
        const appuntamentoOld = await Appuntamento.find(id)
        if(!appuntamentoOld){
            res.status(400).json({message: 'Appuntamento non trovato'})
        }

        const paziente = await getPaziente(data.cfPaziente)
        
        if(!paziente){
            res.status(400).json({message: 'Paziente non trovato'})
        }

        if(paziente.nome != data.nome){
            res.status(400).json({message: 'Nome non valido'})
        }

        if(paziente.cognome != data.cognome){
            res.status(400).json({message: 'Cognome non valido'})
        }


        const farmaco = await getFarmaco(nomeFarmaco)

        if(!farmaco){
            res.status(400).json({message: 'Farmaco non valido'})
        }

        const appuntamentoMod = await Appuntamento.findByIdAndUpdate(id, data, { new: true }) //new ture serve per restituire effetivamente il json aggiornato

        res.status(200).json(appuntamento)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per l'instaziazione di un nuovo oggetto Appuntamento
exports.createAppuntamento = async (req, res) => {
    try {
        const appuntamento = new Appuntamento(req.body)
        res.status(201).json(appuntamento)
    } catch (error) {
        res.status(505).json(error.message)
    }

}