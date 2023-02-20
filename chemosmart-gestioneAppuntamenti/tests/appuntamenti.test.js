const { insertAppuntamento, deleteAppuntamento } = require('../controllers/appuntamenti');
const {getPaziente, getFarmaco} = require('../services/apiClient')
const Appuntamento = require('../models/appuntamento');
const axios = require('axios')

jest.mock('../services/apiClient');
jest.mock('../models/appuntamento');
jest.mock('axios')

describe('insertAppuntamento', () => {
  const req = {
      body: {
          cfPaziente: 'ABCDEF01G1234567',
          farmaco: 'Aspirina',
          dataFine: new Date(Date.now() + 180 * 60 * 1000),
          dataInizio: new Date(Date.now() + 120 * 60 * 1000),
          nome: 'Mario',
          cognome: 'Rossi',
      }
  }

  const res = {
      status: jest.fn(() => res),
      json: jest.fn()
  }

  const mockGetPaziente = getPaziente.mockImplementation(cf => {
    return {
      cf: req.body.cfPaziente,
      nome: req.body.nome,
      cognome: req.body.cognome
    }
  })

  const mockGetFarmaco = getFarmaco.mockImplementation(farmaco => {
    return {
      nome: req.body.farmaco
    }
  })

  const mockAppuntamentoSave = Appuntamento.mockImplementation(() => {
    return {
        save: jest.fn(() => Promise.resolve())
    }
  })

  const appuntamentoMock  = {
    cfPaziente: req.body.cfPaziente,
    farmaco: req.body.farmaco,
    dataInizio: req.body.dataInizio,
    dataFine: req.body.dataFine,
    nome: req.body.nome,
    cognome: req.body.cognome
  }

  afterEach(() => {
      jest.clearAllMocks()
  })

  test('[TC_2.1_1] Il CF non è presente nel database pazienti', async () => {
    const invalidCF = 'ABCD123'
    const error = 'errore ricerca paziente'

      mockGetPaziente.mockRejectedValue(error)

      await insertAppuntamento(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({message: error.message})
  })

  test('[TC_2.1_2] Il nome non corrisponde al paziente selezionato', async () => {
      const invalidNome = 'Luigi'
      mockGetPaziente.mockResolvedValue({data: {
          cf: req.body.cfPaziente,
          nome: invalidNome,
          cognome: req.body.cognome
      }})
      const error = 'Nome non valido'
      await insertAppuntamento(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: error })
  })

  test('[TC_2.1_3] Il cognome non corrisponde al paziente selezionato', async () => {
      const invalidCognome = 'Bianchi'
      mockGetPaziente.mockResolvedValue({data: {
          cf: req.body.cfPaziente,
          nome: req.body.nome,
          cognome: invalidCognome
      }})

      await insertAppuntamento(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Cognome non valido' })
  })

  test('[TC_2.1_4] Restituisce errore se dataInizio invalida', async () => {
      const invalidDataInizio = new Date('2023-02-17T09:00:00.000Z')
      req.body.dataInizio = invalidDataInizio

      await insertAppuntamento(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'DataInizio non valida' })
  })

  test('[TC_2.1_5] Restituisce errore se dataFine invalida', async () => {
    const invalidDataFine = new Date('2023-02-17T09:00:00.000Z')
    req.body.dataFine = invalidDataFine

    await insertAppuntamento(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: 'DataFine non valida'})
  })

  test('[TC_2.1_6] Restituisce errore se la dataFine è minore della dataInizio', async () => {
    const dataInizioValida = new Date(Date.now() + 60 * 60 * 1000)
    const invalidDateFine = new Date()
    req.body.dataInizio = dataInizioValida
    req.body.dataFine = invalidDateFine

    await insertAppuntamento(req,res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: 'Date non valide'})
  })

  test('[TC_2.1_7] Il farmaco inserito non è presente nel database', async () => {
    mockGetPaziente.mockResolvedValue({data:{
        cf: req.body.cfPaziente,
        nome: req.body.nome,
        cognome: req.body.cognome,
    }})

    const error = 'Farmaco non trovato'
    mockGetFarmaco.mockRejectedValue(error)

    await insertAppuntamento(req,res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({message: error.message})
  })

  test('[TC_2.1_8] L\'inserimento va a buon fine', async () => {
    mockGetPaziente.mockResolvedValue({data: {
        cf: req.body.cfPaziente,
        nome: req.body.nome,
        cognome: req.body.cognome,
    }})

    mockGetFarmaco.mockResolvedValue({data:{
        nome: req.body.farmaco
    }})

    await insertAppuntamento(req,res)

    expect(mockAppuntamentoSave).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(mockAppuntamentoSave).toHaveBeenCalledWith(req.body)
  })
})

describe('deleteAppuntamento', () => {
  const req = {
    params: {
      id: '123'
    },
    query: {
      cfPaziente: 'ABCD1234',
      nome: 'Mario',
      cognome: 'Rossi'
    }
  }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('[TC_2.2_1] Appuntamento non presente nel database', async () => {
    const findByIdMock = jest.fn().mockReturnValue(null)
    Appuntamento.findById = findByIdMock
    await deleteAppuntamento(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
  })

  it('[TC_2.2_2] CF non corrisponde', async() => {
    const findByIdMock = jest.fn().mockReturnValue({ cfPaziente: '123456' })
    Appuntamento.findById = findByIdMock
    await deleteAppuntamento(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith('CF non corrisponde')
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
  })

  it('[TC_2.2_3] Nome non corrisponde', async () => {
    const findByIdMock = jest.fn().mockReturnValue({ nome: 'Luca', cognome: 'Rossi' })
    Appuntamento.findById = findByIdMock
    await deleteAppuntamento(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith('Nome non corrisponde')
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
  })

  it('[TC_2.2_4] Cognome non corrisponde', async () => {
      const findByIdMock = jest.fn().mockReturnValue({ nome: 'Mario', cognome: 'Bianchi' })
      Appuntamento.findById = findByIdMock
      await deleteAppuntamento(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith('Cognome non corrisponde')
      expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
    })


  it('[TC_2.2_5] Cancella l\'appuntamento e ritorna un messaggio di successo', async () => {
    const findByIdMock = jest.fn().mockReturnValue({ nome: 'Mario', cognome: 'Rossi' })
    Appuntamento.findById = findByIdMock
    const findByIdAndDeleteMock = jest.fn().mockResolvedValue({})
    Appuntamento.findByIdAndDelete = findByIdAndDeleteMock
    await deleteAppuntamento(req, res)
    expect(res.json).toHaveBeenCalledWith({ message: 'Appuntamento eliminato con successo' })
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(req.params.id)
  })
})