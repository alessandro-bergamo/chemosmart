const Appuntamento = require('../models/appuntamento.js')
const { getPaziente, getFarmaco } = require('../services/apiClient')
const axios = require('axios')

/**
Questa funzione permette di inserire un nuovo appuntamento
@function insertAppuntamento
@param {Object} req - Request object
@param {Object} res - Response object
@throws {Object} 400 - Il nome, il cognome, la data di inizio, la data di fine o le date non sono valide
@throws {Object} 409 - Paziente o farmaco non trovato, oppure errore nella creazione dell'appuntamento
@returns {Object} - L'appuntamento appena creato
@author Luigi Miranda
@precondition Il paziente esiste nel database e il nome, cognome, dataInizio e dataFine sono validi
@postcondition Viene creato un nuovo appuntamento nel database
*/
exports.insertAppuntamento = async (req, res) => {
    const cf = req.body.cfPaziente

    try {
        const response = await getPaziente(cf)
        const paziente = response.data

        if (paziente.nome != req.body.nome) {
            res.status(400).json({ message: 'Nome non valido' })
        }

        if (paziente.cognome != req.body.cognome) {
            res.status(400).json({ message: 'Cognome non valido' })
        }

        const dataInizio = new Date(req.body.dataInizio)
        const dataFine = new Date(req.body.dataFine)
        const dataOdierna = new Date()

        if (dataInizio.getTime() < dataOdierna.getTime()) {
            res.status(400).json({ message: 'DataInizio non valida' })
        }

        if (dataFine.getTime() < dataOdierna.getTime()) {
            res.status(400).json({ message: 'DataFine non valida' })
        }

        if (dataFine.getTime() < dataInizio.getTime()) {
            res.status(400).json({ message: 'Date non valide' })
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
    } catch (error) {
        res.status(409).json({ message: error.message })
    }

}

/**
@function formattaParole
@description Formatta una stringa di parole in modo che ogni parola inizi con la maiuscola e poi abbia tutte le altre lettere in minuscolo.
@param {string} parole - La stringa di parole da formattare.
@throws {TypeError} Se il parametro parole non è una stringa.
@returns {string} La stringa di parole formattate.
@author Luigi Miranda
@precondition La stringa di parole deve essere una stringa valida.
@postcondition La stringa di parole viene formattata in modo che ogni parola inizi con la maiuscola e poi abbia tutte le altre lettere in minuscolo.
*/
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


/**
@function getAllAppuntamenti
@description Funzione per ottenere tutti gli appuntamenti salvati nel database e formattarli come eventi per il calendario.
@param {Object} req - Oggetto contenente la richiesta HTTP.
@param {Object} res - Oggetto contenente la risposta HTTP.
@returns {Array} - Ritorna un oggetto contenente gli eventi degli appuntamenti formattati come richiesto per il calendario.
@throws {Object} - Ritorna un oggetto contenente un messaggio di errore nel caso in cui ci sia un problema con la query al database.
@author Luigi Miranda
@precondition -
@postcondition - Vengono restituiti tutti gli appuntamenti sotto forma di eventi formattati
*/
exports.getAllAppuntamenti = (req, res) => {
    const appuntamento = Appuntamento.find({})
        .then(appuntamenti => {
            const events = [];
            for (const appuntamento of appuntamenti) {
                events.push({
                    title: formattaParole(appuntamento.nome + ' ' + appuntamento.cognome),
                    start: appuntamento.dataInizio,
                    end: appuntamento.dataFine,
                    id: appuntamento._id,
                    cfPaziente: appuntamento.cfPaziente,
                    farmaco: appuntamento.farmaco,
                    nome: appuntamento.nome,
                    cognome: appuntamento.cognome
                });
            }
            res.send(events);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
}

/**
@function getAppuntamentoById
@async
@description Restituisce l'appuntamento associato all'id passato come parametro
@param {String} id - L'id dell'appuntamento
@throws {404} - Se l'appuntamento con l'id passato non esiste
@returns {Object} - L'appuntamento associato all'id passato
@precondition - L'id passato deve esistere
@postcondition - Viene restituito l'appuntamento associato all'id passato
@author Luigi Miranda
*/
exports.getAppuntamentoById = async (req, res) => {
    const id = req.params.id

    if (!id) {
        res.status(400).json()
    }
    try {
        const appuntamento = await Appuntamento.findById(id)
        res.status(200).json(appuntamento)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
@function deleteAppuntamento
@async
@description Elimina un appuntamento dal database controllando che i dati inseriti siano corretti
@param {Object} req - Oggetto della richiesta HTTP
@param {Object} res - Oggetto della risposta HTTP
@throws {Object} 404 - Appuntamento non trovato
@returns {Object} - Messaggio di successo con HTTP status code 200
@author Luigi Miranda
@precondition L'appuntamento esiste nel database e i dati inseriti sono corretti
@postcondition L'appuntamento viene eliminato dal database
*/
exports.deleteAppuntamento = async (req, res) => {
    const id = req.params.id
    const cf = req.query.cf
    const nome = req.query.nome
    const cognome = req.query.cognome
    try {
        const appuntamento = await Appuntamento.findById(id)
        console.log(appuntamento)
        if (appuntamento.cfPaziente != cf) {
            console.log('errore cf')
            res.status(400).json('CF non corrisponde')
        }

        if (appuntamento.nome != nome) {
            console.log('errore nome')
            res.status(400).json('Nome non corrisponde')
        }

        if (appuntamento.cognome != cognome) {
            console.log('errore cognome')
            res.status(400).json('Cognome non corrisponde')
        }
        await Appuntamento.findByIdAndDelete(id)
        res.json({ message: 'Appuntamento eliminato con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
Aggiorna un appuntamento esistente
@function updateAppuntamento
@async
@param {Object} req - la richiesta HTTP
@param {Object} res - la risposta HTTP
@throws {Object} 400 - se il paziente non viene trovato, i dati sono incompleti o non validi, il farmaco non viene trovato
@throws {Object} 404 - se l'appuntamento non viene trovato
@returns {Object} - restituisce l'appuntamento aggiornato
@description Questa funzione permette di aggiornare un appuntamento esistente verificando che il paziente sia presente nella base di dati, che i dati siano completi e validi e che il farmaco sia presente nella base di dati. Restituisce l'appuntamento aggiornato.
@precondition L'appuntamento deve essere già presente nella base di dati.
@postcondition L'appuntamento viene aggiornato con i nuovi dati e viene restituito il json dell'appuntamento aggiornato.
@autor Luigi Miranda
*/
exports.updateAppuntamento = async (req, res) => {
    const id = req.params.id

    const data = { ...req.body }
    try {
        const appuntamentoOld = await Appuntamento.findById(id)

        const response = await getPaziente(req.body.cfPaziente)
        const paziente = response.data
        if (!paziente) {
            res.status(400).json({ message: 'Paziente non trovato' })
            return
        }

        if (paziente.cf != data.cfPaziente) {
            res.status(400).json({ message: 'CF non valido' })
        }

        if (paziente.nome != data.nome) {
            res.status(400).json({ message: 'Nome non valido' })
            return
        }

        if (paziente.cognome != data.cognome) {
            res.status(400).json({ message: 'Cognome non valido' })
            return
        }

        const dataInizio = new Date(req.body.dataInizio)
        const dataFine = new Date(req.body.dataFine)
        const dataOdierna = new Date()

        if (dataInizio.getTime() < dataOdierna.getTime()) {
            res.status(400).json({ message: 'DataInizio non valida' })
            return
        }

        if (dataFine.getTime() < dataOdierna.getTime()) {
            res.status(400).json({ message: 'DataFine non valida' })
            return
        }

        if (dataFine.getTime() < dataInizio.getTime()) {
            res.status(400).json({ message: 'Date non valide' })
            return
        }

        const responseFarmaco = await getFarmaco(req.body.farmaco)
        const farmaco = responseFarmaco.data
        if (!farmaco) {
            res.status(400).json('Farmaco non trovato')
            return
        }
        const appuntamentoMod = await Appuntamento.findByIdAndUpdate(id, data, { new: true }) //new ture serve per restituire effetivamente il json aggiornato
        res.status(200).json(appuntamentoMod)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
Crea un nuovo appuntamento
@function createAppuntamento
@param {Object} req - Oggetto della richiesta HTTP
@param {Object} res - Oggetto della risposta HTTP
@returns {Object} L'oggetto JSON dell'appuntamento creato
@throws {Object} Errore HTTP 505 se si verifica un errore durante la creazione dell'appuntamento
*/
exports.createAppuntamento = async (req, res) => {
    try {
        const appuntamento = new Appuntamento(req.body)
        res.status(201).json(appuntamento)
    } catch (error) {
        res.status(505).json(error.message)
    }

}