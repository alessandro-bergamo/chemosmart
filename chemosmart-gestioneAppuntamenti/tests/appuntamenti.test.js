// controllers/appuntamenti.test.js
jest.mock('../models/appuntamento.js')
const Appuntamento = require('../models/appuntamento');
const { insertAppuntamento, getAllAppuntamenti, getAppuntamentoById, deleteAppuntamento } = require('../controllers/appuntamenti')



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

  test('dovrebbe restituire 400 se mancano i campi obbligatori', async () => {
    delete appuntamento.cfPaziente;
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('dovrebbe restituire 400 se il codice fiscale non è valido', async () => {
    appuntamento.cfPaziente = 'invalid-cf';
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  test('dovrebbe restituire 400 se nome o cognome contengono caratteri non validi', async () => {
    appuntamento.nome = 'Mario1';
    await insertAppuntamento(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

test('deve creare un nuovo appuntamento e restituirlo con stato 201', async () => {

  const savedAppuntamento = { ...appuntamento, save: jest.fn() }

  Appuntamento.mockReturnValue(savedAppuntamento)

  await insertAppuntamento(req, res)

  expect(Appuntamento).toHaveBeenCalledWith(appuntamento)
  expect(savedAppuntamento.save).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(201)
  expect(res.json).toHaveBeenCalledWith(savedAppuntamento)
});



  test('dovrebbe restituire 409 se il salvataggio fallisce', async () => {
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

  test('dovrebbe restituire 200 e l'appuntamento se esiste', async () => {
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

  test('dovrebbe restituire 404 se l'appuntamento non esiste', async () => {
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

/*


describe('deleteAppuntamento', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it("dovrebbe cancellare l'appuntamento e restituire il messaggio di successo", async () => {
    const appuntamento = { _id: '123' };
    Appuntamento.findByIdAndDelete = jest.fn().mockResolvedValueOnce(appuntamento);
    await deleteAppuntamento(req, res);
    expect(Appuntamento.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith({ message: 'Appuntamento eliminato con successo' });
  });

  it('dovrebbe restituire 404 se appuntamento non trovato', async () => {
    const error = new Error('Appuntamento non trovato');
    Appuntamento.findByIdAndDelete = jest.fn().mockRejectedValueOnce(error);
    await deleteAppuntamento(req, res);
    expect(Appuntamento.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
*/

/*
  Test per getAllAppuntamenti
*/

describe('getAllAppuntamenti', () => {
  it('should return all appuntamenti as events', async () => {
    // Mocking Appuntamento.find() to return an array of two appuntamenti
    
    const mockAppuntamenti = [
      {
        _id: '1234',
        nome: 'Appuntamento 1',
        dataInizio: new Date('2023-02-20T10:00:00Z'),
        dataFine: new Date('2023-02-20T11:00:00Z'),
        cfPaziente: 'ABC123',
        farmaco: 'Farmaco 1',
        cognome: 'Rossi'
      },
      {
        _id: '5678',
        nome: 'Appuntamento 2',
        dataInizio: new Date('2023-02-21T15:00:00Z'),
        dataFine: new Date('2023-02-21T16:00:00Z'),
        cfPaziente: 'DEF456',
        farmaco: 'Farmaco 2',
        cognome: 'Verdi'
      }
    ];
    


    const findSpy = jest.spyOn(Appuntamento, 'find').mockResolvedValue(mockAppuntamenti);

    // Mocking res.send() and res.status() to check response
    const sendMock = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const res = { send: sendMock, status: statusMock };

    // Calling the function and checking the response
    getAllAppuntamenti(null, res);
    expect(findSpy).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith([
      {
        title: 'Appuntamento 1',
        start: mockAppuntamenti[0].dataInizio,
        end: mockAppuntamenti[0].dataFine,
        id: '1234'
      },
      {
        title: 'Appuntamento 2',
        start: mockAppuntamenti[1].dataInizio,
        end: mockAppuntamenti[1].dataFine,
        id: '5678'
      }
    ]);
    expect(statusMock).not.toHaveBeenCalled();
  });
/*
  it('should return a 500 status code and an error message if an error occurs', async () => {
    // Mocking Appuntamento.find() to throw an error
    const findSpy = jest.spyOn(Appuntamento, 'find').mockRejectedValue('Database error');

    // Mocking res.status() and res.send() to check response
    const sendMock = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const res = { send: sendMock, status: statusMock };

    // Calling the function and checking the response
    getAllAppuntamenti(null, res);
    expect(findSpy).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Database error');
  });
  */
});
