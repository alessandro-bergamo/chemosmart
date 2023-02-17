const { deleteFarmaco, updateFarmaco,getAllFarmaci,getFarmacoById } = require('../controllers/farmaci') 
const Farmaco = require('../models/farmaco')

describe('deleteFarmaco', () => {
    test('Dovrebbe cancellare un Farmaco con l\'id passato e restituire un messaggio di successo', async () => {
        const id = '123'
        const req = {
            params: {
                id: id
            }
        }
        const res = {
            json: jest.fn()
        }
        jest.spyOn(Farmaco, 'findByIdAndDelete').mockResolvedValueOnce()

        await deleteFarmaco(req, res)

        expect(Farmaco.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(res.json).toHaveBeenCalledWith({ message: 'Farmaco eliminato con successo' })
    })

    test('Dovrebbe impostare stato richiesta codice 404 e restituire errore in caso di Farmaco non trovato', async () => {
        const id = '123'
        const req = {
            params: {
                id: id
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const errorMessage = 'Farmaco non trovato'
        jest.spyOn(Farmaco, 'findByIdAndDelete').mockRejectedValueOnce(new Error(errorMessage))

        await deleteFarmaco(req, res)

        expect(Farmaco.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})

//Aggiorna Farmaco
describe('updateFarmaco', () => {
    test('Dovrebbe aggiornare il Farmaco tramite l\'id ricevuto in input e restituire il Farmaco aggiornato', async () => {
        const id = '123'
        const data = {
            stock: 200
        }
        const req = {
            params: {
                id: id
            },
            body: data
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const updatedFarmaco = {
            _id: id,
            ...data
        }
        jest.spyOn(Farmaco, 'findByIdAndUpdate').mockResolvedValueOnce(updatedFarmaco)

        await updateFarmaco(req, res)

        expect(Farmaco.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(updatedFarmaco)
    })

    test('Dovrebbe impostare stato della richiesta a 404 e restituire un messaggio di errore se il Farmaco con dato id di input non è presente' , async () => {
        const id = '123'
        const data = {
            stock: 200
        }
        const req = {
            params: {
                id: id
            },
            body: data
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const errorMessage = 'Farmaco non trovato'
        jest.spyOn(Farmaco, 'findByIdAndUpdate').mockRejectedValueOnce(new Error(errorMessage))

        await updateFarmaco(req, res)

        expect(Farmaco.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true })
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})

//Restituisce Tutte i Farmaci
describe('getAllFarmaci', () => {
    it('Dovrebbe restituire tutti i Farmaci', async () => {
        const farmaci = [
            {
                nome:"Docetaxel",
                descrizione:"un agente chemioterapico, appartenente alla classe dei farmaci cosidde…",
                dose:"200mg/ml",
                stock:40  
            },
            {
                nome:"Gemcitabina",
                descrizione:"farmaco antineoplastico del gruppo degli antimetaboliti pirimidinici",
                dose:"150mg",
                stock:80  
            }
        ]
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        jest.spyOn(Farmaco, 'find').mockResolvedValue(farmaci)
        await getAllFarmaci(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(farmaci)
        expect(Farmaco.find).toHaveBeenCalled()
    })

    it('Dovrebbe restituire una risposta di errore con status 404 se c\'è un errore nella restituzione di tutti i farmaci', async () => {
        const errorMessage = 'Nessun Farmaco trovato'
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        jest.spyOn(Farmaco, 'find').mockRejectedValue(new Error(errorMessage))
        await getAllFarmaci(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
        expect(Farmaco.find).toHaveBeenCalled()
    })
})

//Restituisce un farmaco in base al suo id
describe('getFarmacoById', () => {
    it('Dovrebbe utilizzare la funzione findById e restituire un farmaco il cui id Ã¨ uguale a quello passato in input', async () => {
      const id = '1234'
      const farmaci = [
        {
            nome:"Docetaxel",
            descrizione:"un agente chemioterapico, appartenente alla classe dei farmaci cosidde…",
            dose:"200mg/ml",
            stock:40  
        },
        {
            nome:"Gemcitabina",
            descrizione:"farmaco antineoplastico del gruppo degli antimetaboliti pirimidinici",
            dose:"150mg",
            stock:80  
        }
    ]
      const req = { params: { id } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      jest.spyOn(Farmaco, 'findById').mockResolvedValueOnce(farmaci[0])
      await getFarmacoById(req, res)
      
      expect(Farmaco.findById).toHaveBeenCalledWith(id)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(farmaci[0])
    })
  
    it('Dovrebbe restituire una lista di farmaci vuota se nessun farmaco ha id uguale a quello passato in input', async () => {
      const id = '5678'
      const farmaci = [
        {
            nome:"Docetaxel",
            descrizione:"un agente chemioterapico, appartenente alla classe dei farmaci cosidde…",
            dose:"200mg/ml",
            stock:40  
        },
        {
            nome:"Gemcitabina",
            descrizione:"farmaco antineoplastico del gruppo degli antimetaboliti pirimidinici",
            dose:"150mg",
            stock:80  
        }
    ]
      const req = { params: { id } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      jest.spyOn(Farmaco, 'findById').mockResolvedValueOnce([])
      await getFarmacoById(req, res)
  
      expect(Farmaco.findById).toHaveBeenCalledWith(id)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })
  
    it('Dovrebbe impostare lo stato della chiamata al codice 404 e restiruire messaggio di errore', async () => {
      const id = 'abcd'
      const errorMessage = 'An error occurred'
      const req = { params: { id } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      jest.spyOn(Farmaco, 'findById').mockRejectedValueOnce(new Error(errorMessage))
      await getFarmacoById(req, res)
  
      expect(Farmaco.findById).toHaveBeenCalledWith(id)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
  })