// controllers/appuntamenti.test.js
const Appuntamento = require('../models/appuntamento')
const appuntamentiController = require('../controllers/appuntamenti')


jest.mock('../models/appuntamento.js')
describe('insertAppuntamento', () => {
  test('should create a new appuntamento and return it with status 201', async () => {
    const appuntamento = {
      cfPaziente: 'aa',
      dataInizio: '2023-02-18',
      dataFine: '2023-02-18',
      farmaco: 'aspirina',
    }

    const req = { body: appuntamento }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const savedAppuntamento = { ...appuntamento, save: jest.fn() }

    Appuntamento.mockReturnValue(savedAppuntamento)

    await appuntamentiController.insertAppuntamento(req, res)

    expect(Appuntamento).toHaveBeenCalledWith(appuntamento)
    expect(savedAppuntamento.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(savedAppuntamento)
  })
})
