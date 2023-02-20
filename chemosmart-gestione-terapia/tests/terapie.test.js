const Terapia = require('../models/terapia')
const { getTerapiaFilter } = require('../controllers/terapie')

//Restituisce Terapia Filtrata
describe('getTerapiaFilter', () => {
    test('[TC1.1_1] Dovrebbe impostare lo stato della richiesta al codice 404 e restituire un messaggio di errore in caso di errore nella ricerca della Terapia', async () => {
        const cf = 'abc123'
        const req = {
            query: {
                cf: cf
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const errorMessage = 'Errore durante il recupero delle terapie'
        jest.spyOn(Terapia, 'find').mockRejectedValue(errorMessage)

        await getTerapiaFilter(req, res)

        expect(Terapia.find).toHaveBeenCalledWith({ cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i').exec() } })
        expect(res.status).toHaveBeenCalledWith(404)
    })
    
    test('[TC_1.1_2] Dovrebbe restituire un array di Terapia vuoto se nessuna Terapia ha come cfPaziente il cf passato in input', async () => {
        const cf = 'abc123'
        const req = {
            query: {
                cf: cf
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const terapia = [{
            _id: '1',
            cfPaziente: 'abc12345',
            farmaco: 'Aspirina',
            dataInizio: '2023-01-15T00:00:00.000Z',
            numAppuntamenti: 4,
            frequenzaAppuntamenti: 14,
            stato: 'In corso'
        }]
        jest.spyOn(Terapia, 'find').mockResolvedValueOnce([])

        await getTerapiaFilter(req, res)

        expect(Terapia.find).toHaveBeenCalledWith({ cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i').exec()} })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([])
    })

    test('[TC_1.1_3] Dovrebbe restiruire la Terapia il cui cfPaziente è uguale al cf passato in input', async () => {
        const cf = 'abc123'
        const req = {
            query: {
                cf: cf
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const terapia = [
            {
                _id: '1',
                cfPaziente: 'abc123',
                farmaco: 'Aspirina',
                dataInizio: '2023-01-15T00:00:00.000Z',
                numAppuntamenti: 4,
                frequenzaAppuntamenti: 14,
                stato: 'In corso'
            },
            {
                _id: '2',
                cfPaziente: 'abc1234',
                farmaco: 'Aspirina',
                dataInizio: '2023-01-16T00:00:00.000Z',
                numAppuntamenti: 5,
                frequenzaAppuntamenti: 14,
                stato: 'In corso'
            }
        ]
        jest.spyOn(Terapia, 'find').mockResolvedValueOnce(terapia[0])

        await getTerapiaFilter(req, res)

        expect(Terapia.find).toHaveBeenCalledWith({cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i').exec()}})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(terapia[0])
    })
})