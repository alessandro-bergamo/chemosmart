const Appuntamento = require('../models/appuntamento.js')
const {getPaziente, getFarmaco} = require('../services/apiClient')
const axios = require('axios')

//controller per inserire un appuntamento 
exports.insertAppuntamento = async (req, res) => {
    const cf = req.body.cfPaziente

    try{
        const response = await getPaziente(cf)
        const paziente = response.data

        if(paziente.nome != req.body.nome){
            res.status(400).json({message: 'Nome non valido'})
        }
        
        if(paziente.cognome != req.body.cognome){
            res.status(400).json({message: 'Cognome non valido'})
        }

        const dataInizio = new Date(req.body.dataInizio)
        const dataFine = new Date(req.body.dataFine)
        const dataOdierna = new Date()

        if(dataInizio.getTime() < dataOdierna.getTime()){
            res.status(400).json({message: 'DataInizio non valida'})
        }

        if(dataFine.getTime() < dataOdierna.getTime()){
            res.status(400).json({message: 'DataFine non valida'})
        }

        if(dataFine.getTime() < dataInizio.getTime()){
            res.status(400).json({message: 'Date non valide'})
        }

        const responseFarmaco = await getFarmaco(req.body.farmaco)
        const farmaco = responseFarmaco.data

        const appuntamento = new Appuntamento(req.body)
        try {
            await appuntamento.save()
            res.status(201).json(appuntamento)
        } catch (error) {
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
    const cf = req.query.cf
    const nome = req.query.nome
    const cognome = req.query.cognome
    try {
        const appuntamento =  await Appuntamento.findById(id)
        console.log(appuntamento)
        if(appuntamento.cfPaziente != cf) {
            console.log('errore cf')
            res.status(400).json('CF non corrisponde')
        }

        if(appuntamento.nome != nome){
            console.log('errore nome')
            res.status(400).json('Nome non corrisponde')
        }

        if(appuntamento.cognome != cognome) {
            console.log('errore cognome')
            res.status(400).json('Cognome non corrisponde')
        }
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