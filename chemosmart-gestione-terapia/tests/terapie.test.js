const Terapia = require('../models/terapia')
const { getTerapiaFilter, updateTerapia } = require('../controllers/terapie')
const { getPaziente, getFarmaco } = require('../services/apiClient')
const axios = require('axios')

jest.mock('../services/apiClient');
jest.mock('../models/terapia');
jest.mock('axios')

//Restituisce Terapia Filtrata
// describe('getTerapiaFilter', () => {
//     test('[TC1.1_1] Dovrebbe impostare lo stato della richiesta al codice 404 e restituire un messaggio di errore in caso di errore nella ricerca della Terapia', async () => {
//         const cf = 'abc123'
//         const req = {
//             query: {
//                 cf: cf
//             }
//         }
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         }
//         const errorMessage = 'Errore durante il recupero delle terapie'
//         jest.spyOn(Terapia, 'find').mockRejectedValue(errorMessage)

//         await getTerapiaFilter(req, res)

//         expect(Terapia.find().exec()).toHaveBeenCalledWith({ cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i') } })
//         expect(res.status).toHaveBeenCalledWith(404)
//     })

//     test('[TC_1.1_2] Dovrebbe restituire un array di Terapia vuoto se nessuna Terapia ha come cfPaziente il cf passato in input', async () => {
//         const cf = 'abc123'
//         const req = {
//             query: {
//                 cf: cf
//             }
//         }
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         }
//         const terapia = [{
//             _id: '1',
//             cfPaziente: 'abc12345',
//             farmaco: 'Aspirina',
//             dataInizio: '2023-01-15T00:00:00.000Z',
//             numAppuntamenti: 4,
//             frequenzaAppuntamenti: 14,
//             stato: 'In corso'
//         }]
//         jest.spyOn(Terapia, 'find').mockResolvedValueOnce([])

//         await getTerapiaFilter(req, res)

//         expect(Terapia.find().exec()).toHaveBeenCalledWith({ cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i') } })
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(res.json).toHaveBeenCalledWith([])
//     })

//     test('[TC_1.1_3] Dovrebbe restiruire la Terapia il cui cfPaziente è uguale al cf passato in input', async () => {
//         const cf = 'abc123'
//         const req = {
//             query: {
//                 cf: cf
//             }
//         }
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         }
//         const terapia = [
//             {
//                 _id: '1',
//                 cfPaziente: 'abc123',
//                 farmaco: 'Aspirina',
//                 dataInizio: '2023-01-15T00:00:00.000Z',
//                 numAppuntamenti: 4,
//                 frequenzaAppuntamenti: 14,
//                 stato: 'In corso'
//             },
//             {
//                 _id: '2',
//                 cfPaziente: 'abc1234',
//                 farmaco: 'Aspirina',
//                 dataInizio: '2023-01-16T00:00:00.000Z',
//                 numAppuntamenti: 5,
//                 frequenzaAppuntamenti: 14,
//                 stato: 'In corso'
//             }
//         ]
//         jest.spyOn(Terapia, 'find').mockResolvedValueOnce(terapia[0])

//         await getTerapiaFilter(req, res)

//         expect(Terapia.find().exec()).toHaveBeenCalledWith({ cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i') } })
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(res.json).toHaveBeenCalledWith(terapia[0])
//     })
// })

//update terapia
describe('updateTerapia', () => {
    const req = {
        params: {
            id: '1234567890',
        },
        body: {
            numAppuntamenti: 2,
            frequenzaAppuntamenti: 14,
            cfPaziente: 'ABCD123456',
            farmaco: 'XYZ',
            dataInizio: new Date('2022-03-05'),
            stato: 'In corso'
        },
    }

    const mockGetPaziente = getPaziente.mockImplementation(cf => {
        return {
            data: {
                cf: req.body.cfPaziente
            }
        }
    })

    const mockGetFarmaco = getFarmaco.mockImplementation(farmaco => {
        return {
            data: {
                nome: req.body.farmaco
            }
        }
    })

    const terapiaMock = {
        id: '1234567890',
        numAppuntamenti: 2,
        frequenzaAppuntamenti: 14,
        cfPaziente: 'ABCD123456',
        farmaco: 'XYZ',
        dataInizio: new Date('2022-03-05'),
        stato: 'In corso'
    }

    const pazienteMock = {
        cf: req.body.cfPaziente
    }

    const farmacoMock = {
        nome: req.body.farmaco
    }

    const res = {
        status: jest.fn(() => res),
        json: jest.fn()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('[TC_2.1_1] Il Paziente non è presente all\'interno del database', async () => {
        Terapia.findById = jest.fn().mockReturnValue(terapiaMock)
        mockGetPaziente.mockRejectedValue('Paziente non trovato')

        await updateTerapia(req, res)

        expect(res.status).toHaveBeenCalledWith(409)
    })

    test('[TC_2.1_2] Il Farmaco non è presente nel database', async () => {
        Terapia.findById = jest.fn().mockReturnValue(terapiaMock)
        const paziente = {
            cf: req.body.cfPaziente
        }
        mockGetPaziente.mockResolvedValue({ data: paziente })
        mockGetFarmaco.mockRejectedValue('Farmaco non valido')

        await updateTerapia(req, res)

        expect(res.status).toHaveBeenCalledWith(409)
    })

    test('[TC_2.1_3] Il numero degli Appuntamenti non è valido', async () => {
        const findMock = jest.fn().mockReturnValue(terapiaMock)
        Terapia.findById = findMock
        mockGetPaziente.mockResolvedValue({ data: pazienteMock })
        mockGetFarmaco.mockResolvedValue({ data: farmacoMock })

        const invalidReq = {
            params: {
                id: '1234567890',
            },
            body: {
                numAppuntamenti: -1,
                frequenzaAppuntamenti: 14,
                cfPaziente: 'ABCD123456',
                farmaco: 'XYZ',
                dataInizio: new Date('2022-03-05'),
                stato: 'In corso'
            },
        }

        await updateTerapia(invalidReq, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Numero appuntamenti non valido')
    })

    test('[TC_2.1_4] La frequenza degli Appuntamenti non è valida', async () => {
        Terapia.findById = jest.fn().mockReturnValue({})

        const invalidReq = {
            ...req,
            body: {
                ...req.body,
                frequenzaAppuntamenti: 10,
            },
        }

        await updateTerapia(invalidReq, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Frequenza appuntamenti non valida')
    })

    test('[TC_2.1_5] Lo stato della Terapia non è valido', async () => {
        Terapia.findById = jest.fn().mockReturnValue({})

        const invalidReq = {
            ...req,
            body: {
                ...req.body,
                stato: 'aaaa',
            },
        }

        await updateTerapia(invalidReq, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Stato della terapia non valido')
    })

    test('[TC_2.1_6] Terapia non trovata', async () => {
        Terapia.findById = jest.fn().mockReturnValue(null)

        await updateTerapia(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Terapia non trovata')
    })

    test('[TC_2.1_7] La Terapia è aggiornata con successo', async () => {
        const updatedTerapia = {
            _id: '1234567890',
            ...req.body,
        }

        Terapia.findById = jest.fn().mockReturnValue(terapiaMock)
        getPaziente.mockResolvedValue({ data: { cf: req.body.cfPaziente } })
        getFarmaco.mockResolvedValue({ data: { nome: req.body.farmaco } })

        Terapia.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTerapia)

        await updateTerapia(req, res)

        expect(res.status).toHaveBeenCalledWith(200)

    })
})