const Appuntamento = require('../models/appuntamento.js')


//controller per inserire un appuntamento 
exports.insertAppuntamento = async (req, res) => {
    const appuntamento = new Appuntamento(req.body)
    
    try {
        await appuntamento.save()
        res.status(201).json(appuntamento)
    } catch (error) {
        res.status(409).json({ message: error.message })
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
          title: formattaParole(appuntamento.nome +' '+ appuntamento.cognome),
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
        const appuntamento = await Appuntamento.findByIdAndUpdate(id, data, {new:true}) //new ture serve per restituire effetivamente il json aggiornato
        
        res.status(200).json(appuntamento)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//controller per l'instaziazione di un nuovo oggetto Appuntamento
exports.createAppuntamento = async (req,res) => {
    try{
        const appuntamento = new Appuntamento(req.body)
        res.status(201).json(appuntamento)
    } catch (error) {
        res.status(505).json(error.message)
    }

}