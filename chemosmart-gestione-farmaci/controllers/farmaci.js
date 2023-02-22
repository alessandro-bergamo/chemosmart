const Farmaco = require('../models/farmaco.js')

/**
Aggiunge un nuovo farmaco al database.
@function insertFarmaco
@param {Object} req - Oggetto richiesta HTTP.
@param {Object} res - Oggetto richiesta HTTP.
@throws {Object} 409 - Errore nel caso in cui il farmaco non possa essere salvato.
@returns {Object} - Restituisce un oggetto JSON rappresentante il farmaco aggiunto.
@description - Questa funzione consente di inserire un nuovo farmaco nel database.
@precondition - La richiesta HTTP deve contenere i dati del farmaco da aggiungere.
@postcondition - Viene restituito un oggetto JSON contenente le informazioni del farmaco aggiunto e questo viene salvato nel database.
@author Mihail Purice
*/
exports.insertFarmaco = async (req, res) => {
    const farmaco = new Farmaco(req.body)

    try {
        await farmaco.save()
        res.status(201).json(farmaco)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

/**
@function getAllFarmaci
@description Restituisce tutti i farmaci presenti nel database
@precondition Il database deve contenere almeno un farmaco
@postcondition Restituisce un array di oggetti contenenti tutti i dati dei farmaci
@param {Object} req - Oggetto richiesta HTTP
@param {Object} res - Oggetto risposta HTTP
@returns {Array} - Array di oggetti contenenti tutti i dati dei farmaci
@throws {Object} - Errore generato dal database o dal server
@author Mihail Purice
*/
exports.getAllFarmaci = async (req, res) => {

    try {
        const farmaci = await Farmaco.find()
        res.status(200).json(farmaci)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
@description Restituisce il farmaco corrispondente all'ID fornito.
@function getFarmacoById
@param {Object} req - Oggetto richiesta HTTP.
@param {Object} res - Oggetto risposta HTTP.
@param {String} id - ID del farmaco da cercare.
@throws {404} - Se non esiste un farmaco con l'ID fornito.
@returns {Object} - Oggetto contenente le informazioni del farmaco cercato.
@precondition L'utente deve essere autenticato e autorizzato.
@postcondition Restituisce un oggetto JSON contenente le informazioni del farmaco cercato.
@author Mihail Purice
*/
exports.getFarmacoById = async (req, res) => {
    const id = req.params.id

    try {
        const farmaco = await Farmaco.findById(id)
        res.status(200).json(farmaco)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/**
Elimina un farmaco tramite l'id.
@function deleteFarmaco
@async
@param {Object} req - L'oggetto della richiesta HTTP
@param {Object} res - L'oggetto della risposta HTTP.
@returns {Object} Messaggio di conferma
@throws {Object} Messaggio di errore nel caso in cui il farmaco non venga trovato
@precondition L'utente deve essere autenticato e autorizzato ad eliminare il farmaco
@postcondition Il farmaco viene eliminato dal database
@description Questa funzione gestisce la richiesta di eliminazione di un farmaco dal database in base all'id fornito. Dopo aver verificato che l'utente sia autenticato e autorizzato, la funzione cerca il farmaco nel database tramite l'id fornito e lo elimina. In caso di successo, viene restituito un messaggio di conferma.
@author Mihail Purice
*/
exports.deleteFarmaco = async (req, res) => {
    const id = req.params.id

    try {
        await Farmaco.findByIdAndDelete(id)
        res.json({ message: 'Farmaco eliminato con successo' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/**
Aggiorna le informazioni di un farmaco nel database.
@async
@function updateFarmaco
@param {Object} req - L'oggetto della richiesta HTTP.
@param {Object} res - L'oggetto della risposta HTTP.
@returns {Promise<void>} Non restituisce alcun valore, ma invia una risposta HTTP.
@throws {Object} Ritorna un oggetto con un messaggio di errore se si verifica un errore durante l'aggiornamento.
@precondition L'ID del farmaco da aggiornare deve essere specificato come parametro nella richiesta.
@precondition I nuovi dati del farmaco da aggiornare devono essere specificati come corpo della richiesta.
@precondition Il valore di 'stock' nei nuovi dati del farmaco deve essere un numero maggiore o uguale a zero.
@postcondizione I dati del farmaco nel database sono stati aggiornati con successo.
@desc Questa funzione riceve una richiesta HTTP per aggiornare le informazioni di un farmaco nel database.
Se il valore di 'stock' nei nuovi dati del farmaco è un numero negativo, la funzione invia una risposta HTTP con uno stato 400 (Bad Request) e un messaggio di errore.
Altrimenti, la funzione cerca il farmaco con l'ID specificato nel database e aggiorna i suoi dati con i nuovi dati forniti nella richiesta. La funzione quindi invia una risposta HTTP con lo stato 200 (OK) e i nuovi dati del farmaco aggiornato.
Se si verifica un errore durante l'aggiornamento, la funzione invia una risposta HTTP con lo stato 404 (Not Found) e un messaggio di errore.
@author Antonio Nappi
*/
exports.updateFarmaco = async (req, res) => {
    const id = req.params.id
    const data = { ...req.body }

    try {
        const farmaco = await Farmaco.findById(id)

        if (!farmaco) {
            res.status(400).json('Farmaco non trovato')
        }

        if (req.body.stock < 0) {
            res.status(400).json("Stock negativo")
            return
        }

        try {
            const farmaco = await Farmaco.findByIdAndUpdate(id, data, { new: true }) //new ture serve per restituire effetivamente il json aggiornato
            res.status(200).json(farmaco)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/**
Questa funzione restituisce un oggetto Farmaco cercato per nome.
@function getFarmacoByNome
@param {Object} req - L'oggetto contenente la richiesta HTTP.
@param {Object} res - L'oggetto contenente la risposta HTTP.
@param {string} req.params.nome - Il nome del farmaco da cercare.
@throws {Error} Se si verificano problemi durante la ricerca del farmaco.
@returns {Object} L'oggetto Farmaco trovato.
@precondition Il parametro 'nome' deve essere una stringa non vuota.
@postcondition Viene restituito l'oggetto Farmaco corrispondente al nome cercato.
@description Questa funzione riceve una richiesta HTTP contenente il nome di un farmaco e restituisce l'oggetto Farmaco corrispondente.
@author Mihail Purice
*/
exports.getFarmacoByNome = async (req, res) => {
    const nome = req.params.nome

    try {
        const farmaco = await Farmaco.findOne({ nome: { $regex: new RegExp("^" + nome.toLowerCase(), "i") } }).exec()

        res.status(200).json(farmaco)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}