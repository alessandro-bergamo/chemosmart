const { deleteFarmaco, updateFarmaco } = require('../controllers/farmaci') 
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