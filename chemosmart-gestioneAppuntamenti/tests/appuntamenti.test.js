// controllers/appuntamenti.test.js
jest.mock('../models/appuntamento.js')
const Appuntamento = require('../models/appuntamento');
const { insertAppuntamento} = require('../controllers/appuntamenti')



/*
  Test per insertAppuntamento 
*/

/*
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
*/


/*
  Test per getAppuntamentoById
*/

/*
const { getAppuntamentoById } = require('../controllers/appuntamenti');

describe('getAppuntamentoById', () => {
  test('should return 400 if id is not provided', async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAppuntamentoById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('should return 200 and the appuntamento if it exists', async () => {
    const id = '123';
    const appuntamento = {
      _id: '123',
      nome: 'Mario',
      cognome: 'Rossi',
      cfPaziente: 'RSSMRA80A01F205Z',
      dataInizio: new Date('2022-03-10T09:00:00.000Z'),
      dataFine: new Date('2022-03-10T10:00:00.000Z'),
      farmaco: 'Aspirina',
    };
    const req = { params: { id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByIdMock = jest.spyOn(Appuntamento, 'findById');
    findByIdMock.mockResolvedValueOnce(appuntamento);

    await getAppuntamentoById(req, res);

    expect(findByIdMock).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(appuntamento);

    findByIdMock.mockRestore();
  });

  test('should return 404 if the appuntamento does not exist', async () => {
    const id = '123';
    const req = { params: { id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new Error('Appuntamento not found');
    const findByIdMock = jest.spyOn(Appuntamento, 'findById');
    findByIdMock.mockRejectedValueOnce(error);

    await getAppuntamentoById(req, res);

    expect(findByIdMock).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });

    findByIdMock.mockRestore();
  });
});
*/

/*
  *** Test per deleteAppuntamento
*/

const { deleteAppuntamento } = require('../controllers/appuntamenti');

describe('deleteAppuntamento', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it('should delete the appuntamento and return success message', async () => {
    const appuntamento = { _id: '123' };
    Appuntamento.findByIdAndDelete = jest.fn().mockResolvedValueOnce(appuntamento);
    await deleteAppuntamento(req, res);
    expect(Appuntamento.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith({ message: 'Appuntamento eliminato con successo' });
  });

  it('should return 404 if appuntamento not found', async () => {
    const error = new Error('Appuntamento non trovato');
    Appuntamento.findByIdAndDelete = jest.fn().mockRejectedValueOnce(error);
    await deleteAppuntamento(req, res);
    expect(Appuntamento.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
