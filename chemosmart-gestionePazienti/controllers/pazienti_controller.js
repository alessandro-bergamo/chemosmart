const Paziente = require('../models/Paziente.js')

/**
@desc Inserisce un nuovo paziente nel database.
@param {Object} req - Oggetto contenente i dati della richiesta HTTP.
@param {Object} res - Oggetto utilizzato per inviare la risposta HTTP.
@returns {Promise} Promessa che rappresenta l'esito dell'operazione di inserimento.
@throws {Error} Errore generato nel caso in cui la creazione del paziente fallisca.
@precondition I dati del paziente devono essere presenti nel corpo della richiesta HTTP.
@postcondition Viene inserito un nuovo paziente nel database e viene restituita la risposta HTTP contenente il paziente creato.
@autor Luigi Miranda
*/
exports.insertPaziente = async(req, res) => {
    const paziente = new Paziente(req.body)

    try {
        await paziente.save()
        res.status(201).json(paziente)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

/**
@desc Recupera tutti i pazienti presenti nel database.
@param {Object} req - Oggetto contenente i dati della richiesta HTTP.
@param {Object} res - Oggetto utilizzato per inviare la risposta HTTP.
@returns {Promise} Promessa che rappresenta l'elenco dei pazienti presenti nel database.
@throws {Error} Errore generato nel caso in cui il recupero dei pazienti fallisca.
@precondition Nessuna.
@postcondition Vengono recuperati tutti i pazienti presenti nel database e viene restituita la risposta HTTP contenente l'elenco dei pazienti.
@autor Luigi Miranda
*/
exports.getAllPazienti = async (req,res) => {
    try {
        const pazienti = await Paziente.find()
        res.status(200).json(pazienti)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
@desc Recupera un paziente dal database tramite il suo ID.
@param {Object} req - Oggetto contenente i dati della richiesta HTTP.
@param {Object} res - Oggetto utilizzato per inviare la risposta HTTP.
@returns {Promise} Promessa che rappresenta il paziente recuperato dal database.
@throws {Error} Errore generato nel caso in cui il recupero del paziente fallisca.
@precondition L'ID del paziente deve essere presente nei parametri della richiesta HTTP.
@postcondition Viene recuperato un paziente dal database tramite il suo ID e viene restituita la risposta HTTP contenente il paziente.
@autor Luigi Miranda
*/
exports.getPazienteById = async(req,res) => {
    const id = req.params.id
    
    try{
       const paziente = await Paziente.findById(id)
       res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

/**
@desc Elimina un paziente tramite il suo ID
@param {Object} req - la richiesta HTTP
@param {Object} res - la risposta HTTP
@pre deve essere stato creato un paziente con l'ID specificato
@post il paziente con l'ID specificato è stato eliminato
@returns {Object} un messaggio di successo
@throws {Object} Errore HTTP con messaggio di errore specificato
@auth operatore sanitario
*/
exports.deletePaziente = async(req,res) => {
    const id = req.params.id

    try {
        await Paziente.findByIdAndDelete(id)
        res.json({message : 'Paziente eliminato con successo'})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

/**
@desc Aggiorna un paziente nel database tramite il suo ID.
@param {Object} req - Oggetto contenente i dati della richiesta HTTP.
@param {Object} res - Oggetto utilizzato per inviare la risposta HTTP.
@returns {Promise} Promessa che rappresenta il paziente aggiornato nel database.
@throws {Error} Errore generato nel caso in cui l'aggiornamento del paziente fallisca.
@precondition L'ID del paziente e i dati da aggiornare devono essere presenti nei parametri della richiesta HTTP.
@postcondition Viene aggiornato un paziente nel database tramite il suo ID e viene restituita la risposta HTTP contenente il paziente aggiornato.
@autor Luigi Miranda
*/
exports.updatePaziente = async(req,res) => {
    const id = req.params.id
    const data = {...req.body}

    try {
        const paziente = await Paziente.findByIdAndUpdate(id, data, {new:true})
        res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

/**
@desc Restituisce i pazienti filtrati tramite una o più query string passate come parametri della richiesta HTTP.
@param {Object} req - Oggetto contenente i dati della richiesta HTTP.
@param {Object} res - Oggetto utilizzato per inviare la risposta HTTP.
@returns {Promise} Promessa che rappresenta i pazienti filtrati tramite le query string.
@throws {Error} Errore generato nel caso in cui la ricerca dei pazienti fallisca.
@precondition Le query string devono essere presenti nei parametri della richiesta HTTP.
@postcondition Vengono restituiti i pazienti filtrati tramite le query string e viene restituita la risposta HTTP contenente i pazienti filtrati.
@autor Giuseppe Rossi
*/
exports.getPazienteFilter = async(req,res) => {
    const nomeQuery = req.query.nome ? req.query.nome : ""
    const cognomeQuery = req.query.cognome ? req.query.cognome : ""
    const cfQuery = req.query.cf ? req.query.cf : ""

    try{
        // const $regex = escapeStringRegexp(nomeQuery);
        const paziente = await Paziente.find({ nome: { $regex: new RegExp("^" + nomeQuery.toLowerCase(), "i")}, cognome: {$regex: new RegExp("^" + cognomeQuery.toLowerCase(), "i")}, cf: {$regex: new RegExp("^" + cfQuery.toLowerCase(), "i")}}).exec()
        console.log(paziente)
        res.status(200).json(paziente)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}
