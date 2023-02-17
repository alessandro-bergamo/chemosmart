const { deleteFarmaco } = require('../controllers/farmaci') 
const Farmaco = require('../models/farmaco')

describe('deleteFarmaco', () => {
    test('deve cancellare un Farmaco con l\'id passato e restituire un messaggio di successo', async () => {
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

    test('in caso di Farmaco non trovato imposta stato richiesta come 400 e restituisce errore', async () => {
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