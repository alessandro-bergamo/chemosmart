const Terapia = require('../models/terapia.js')
const { getPaziente, getFarmaco } = require('../services/apiClient.js')

/**
@function insertTerapia
@description Inserisce una nuova terapia nel database.
@param {object} req - L'oggetto della richiesta HTTP.
@param {object} res - L'oggetto della risposta HTTP.
@throws {object} 409 - Errore di conflitto se ci sono problemi nell'inserimento della terapia.
@returns {object} L'oggetto della terapia appena inserita.
@precondition Il req.body deve contenere i campi necessari per creare un oggetto terapia.
@postcondition Viene inserito un nuovo oggetto terapia nel database e restituito.
@author [Giuseppe Basile]
*/
exports.insertTerapia = async (req, res) => {
    const terapia = new Terapia(req.body)

    try {
        await terapia.save()
        res.status(201).json(terapia)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

/**
@function getAllTerapie
@param {object} req - L'oggetto della richiesta HTTP.
@param {object} res - L'oggetto della risposta HTTP.
@throws {object} 404 - Errore di not found se non ci sono terapie nel database.
@returns {array} Un array contenente tutte le terapie presenti nel database.
@precondition Nessuna precondizione richiesta.
@postcondition Viene restituito un array contenente tutte le terapie presenti nel database.
@author [Giuseppe Basile]
@description Questa funzione recupera tutte le terapie presenti nel database e le restituisce come un array. Se non ci sono terapie presenti nel database, viene restituito un errore 404.
*/
exports.getAllTerapie = async (req, res) => {

    try {
        const terapie = await Terapia.find()
        res.status(200).json(terapie)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
@function getTerapiaById
@param {object} req - L'oggetto della richiesta HTTP.
@param {object} res - L'oggetto della risposta HTTP.
@param {string} req.params.id - L'ID della terapia da recuperare.
@throws {object} 404 - Errore di not found se l'ID non corrisponde ad alcuna terapia nel database.
@returns {object} L'oggetto della terapia corrispondente all'ID fornito.
@precondition L'ID della terapia da recuperare deve essere fornito come parametro nella richiesta.
@postcondition Viene restituito l'oggetto della terapia corrispondente all'ID fornito.
@author [Giuseppe Basile]
@description Questa funzione recupera una terapia dal database tramite l'ID fornito come parametro nella richiesta e la restituisce come un oggetto. Se l'ID non corrisponde ad alcuna terapia nel database, viene restituito un errore 404.
*/
exports.getTerapiaById = async (req, res) => {
    const id = req.params.id

    try {
        const terapia = await Terapia.findById(id)
        res.status(200).json(terapia)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
@function deleteTerapia
@param {Object} req - L'oggetto della richiesta HTTP.
@param {Object} res - L'oggetto della risposta HTTP.
@throws {Object} 404 - Errore di not found se l'ID non corrisponde ad alcuna terapia nel database.
@returns {Object} Un oggetto con il messaggio di successo.
@precondition L'ID della terapia da eliminare deve essere fornito come parametro nella richiesta.
@postcondition La terapia corrispondente all'ID fornito viene eliminata dal database.
@description Questa funzione elimina una terapia dal database tramite l'ID fornito come parametro nella richiesta. Se l'ID non corrisponde ad alcuna terapia nel database, viene restituito un errore 404.
@author [Giuseppe Basile]
*/
exports.deleteTerapia = async (req, res) => {
    const id = req.params.id

    try {
        await Terapia.findByIdAndDelete(id)
        res.json({ message: 'Terapia eliminata con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/**

Aggiorna una terapia nel database tramite ID.
@function updateTerapia
@param {Object} req - L'oggetto della richiesta HTTP.
@param {Object} res - L'oggetto della risposta HTTP.
@throws {Object} 404 - Errore di not found se l'ID non corrisponde ad alcuna terapia nel database.
@returns {Object} L'oggetto della terapia aggiornata.
@precondition L'ID della terapia da aggiornare deve essere fornito come parametro nella richiesta. L'oggetto dei dati della terapia da aggiornare deve essere fornito come corpo della richiesta.
@postcondition La terapia corrispondente all'ID fornito viene aggiornata con i dati forniti nel corpo della richiesta.
@description Questa funzione aggiorna una terapia nel database tramite l'ID fornito come parametro nella richiesta. Se l'ID non corrisponde ad alcuna terapia nel database, viene restituito un errore 404. Viene eseguita anche una serie di controlli sui dati forniti per l'aggiornamento, come il controllo sulla validità del numero di appuntamenti, della frequenza degli appuntamenti, dello stato della terapia, del codice fiscale del paziente e del nome del farmaco.
@author [Giuseppe Basile]
*/
exports.updateTerapia = async (req, res) => {
    const id = req.params.id
    const data = { ...req.body }
    console.log(data)
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

/**
@function getTerapiaFilter
@description Restituisce le terapie filtrate per codice fiscale del paziente.
@param {Object} req - Oggetto della richiesta HTTP.
@param {Object} res - Oggetto della risposta HTTP.
@param {string} req.query.cf - Codice fiscale del paziente per il quale filtrare le terapie (opzionale).
@returns {Object} Un array di oggetti Terapia.
@throws {Object} Errore di tipo Object in caso di fallimento della ricerca.
@precondition L'utente deve aver effettuato una richiesta HTTP valida e deve essere autenticato.
@postcondition Viene restituito un array di oggetti Terapia corrispondente alla query fornita, se presente.
@author [Giuseppe Basile]
*/
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