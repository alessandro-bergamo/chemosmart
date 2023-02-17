// controllers/appuntamenti.test.js

const Appuntamento = require('../models/appuntamento');
const { insertAppuntamento } = require('../controllers/appuntamenti')

jest.mock('../models/appuntamento.js')

describe('insertAppuntamento', () => {
  let req, res, appuntamento;

  beforeEach(() => {
    appuntamento = {
      cfPaziente: 'RSSMRA80A01H501L',
      farmaco: 'Ibuprofene',
      dataInizio: new Date('2023-02-20T09:00:00Z'),
      dataFine: new Date('2023-02-20T10:00:00Z'),
      nome: 'Mario',
      cognome: 'Rossi',
      timestamps: true
    };
    req = { body: appuntamento };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return 400 if required fields are missing', async () => {
    delete appuntamento.cfPaziente;
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('should return 400 if codice fiscale is not valid', async () => {
    appuntamento.cfPaziente = 'invalid-cf';
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('should return 400 if nome or cognome contain invalid characters', async () => {
    appuntamento.nome = 'Mario1';
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

test('should create a new appuntamento and return it with status 201', async () => {

  const savedAppuntamento = { ...appuntamento, save: jest.fn() }

  Appuntamento.mockReturnValue(savedAppuntamento)

  await insertAppuntamento(req, res)

  expect(Appuntamento).toHaveBeenCalledWith(appuntamento)
  expect(savedAppuntamento.save).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.json).toHaveBeenCalledWith(savedAppuntamento)
});



  test('should return 409 if saving fails', async () => {
    const error = new Error('Database error');
    const app = Appuntamento.mockReturnValueOnce({ save: jest.fn().mockRejectedValueOnce(error) });
    await insertAppuntamento(req, res);
    expect(Appuntamento).toHaveBeenCalledWith(appuntamento);
    expect(app).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

});
