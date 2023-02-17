const Terapia = require('../models/terapia')
const { deleteTerapia,updateTerapia,getTerapiaFilter, insertTerapia } = require('../controllers/terapie')

//Cancella Terapia
describe('deleteTerapia', () => {
    test('deve cancellare una Terapia con l\'id passato e restituire un messaggio di successo', async () => {
        const id = '123'
        const req = {
            params: {
                id: id
            }
        }
        const res = {
            json: jest.fn()
        }
        jest.spyOn(Terapia, 'findByIdAndDelete').mockResolvedValueOnce()

        await deleteTerapia(req, res)

        expect(Terapia.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(res.json).toHaveBeenCalledWith({ message: 'Terapia eliminata con successo' })
    })

    test('in caso di Terapia non trovata imposta stato richiesta come 400 e restituisce errore', async () => {
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
        const errorMessage = 'Terapia non trovata'
        jest.spyOn(Terapia, 'findByIdAndDelete').mockRejectedValueOnce(new Error(errorMessage))

        await deleteTerapia(req, res)

        expect(Terapia.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})

//Aggiorna Terapia
describe('updateTerapia', () => {
    test('deve aggiornare la Terapia tramite l\'id ricevuto in input e restituire la Terapia aggiornata', async () => {
        const id = '123'
        const data = {
            farmaco: 'Aspirina',
            stato: 'Terminata'
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
        const updatedTerapia = {
            _id: id,
            ...data
        }
        jest.spyOn(Terapia, 'findByIdAndUpdate').mockResolvedValueOnce(updatedTerapia)

        await updateTerapia(req, res)

        expect(Terapia.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {new:true})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(updatedTerapia)
    })

    test('Se la Terapia con dato id di input non è presente, deve impostare stato della richiesta a 404 e restituire un messaggio di errore', async () => {
        const id = '123'
        const data = {
            farmaco: 'Aspirina',
            stato: 'Terminata'
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
        const errorMessage = 'Terapia non trovata'
        jest.spyOn(Terapia, 'findByIdAndUpdate').mockRejectedValueOnce(new Error(errorMessage))

        await updateTerapia(req, res)

        expect(Terapia.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {new:true})
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})

//Restituisce Terapia Filtrata
describe('getTerapiaFilter', () => {
    test('deve ritornare la Terapia il cui cfPaziente è uguale al cf passato in input', async () => {
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

    test('deve ritornare un array di Terapia vuoto se nessuna Terapia ha come cfPaziente il cf passato in input', async () => {
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

        expect(Terapia.find).toHaveBeenCalledWith({cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i').exec()}})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([])
    })

    test('in caso di errore nella ricerca della Terapia, deve impostare lo stato della richiesta al codice 404 e restituire un messaggio di errore', async () => {
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
        jest.spyOn(Terapia, 'find').mockRejectedValueOnce(new Error(errorMessage))

        await getTerapiaFilter(req, res)

        expect(Terapia.find).toHaveBeenCalledWith({cfPaziente: { $regex: new RegExp(`^${cf.toLowerCase()}`, 'i').exec()}})
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})

//Inserimento Nuova Terapia
describe('insertTerapia', () => {
  const mockReq = {
      body: {
        cfPaziente: 'RSSMRA85A01F205D',
        farmaco: 'Paracetamolo',
        dataInizio: new Date("2022-02-16"),
        numAppuntamenti: 10,
        frequenzaAppuntamenti: 7,
        stato: 'In corso'
      },
  };
  const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
  };

  beforeAll(() => {
      jest.spyOn(Terapia.prototype, 'save').mockResolvedValue();
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  it('Deve inserire una nuova terapia e restituisce 201 come status code', async () => {
      await insertTerapia(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        cfPaziente: mockReq.body.cfPaziente,
        farmaco: mockReq.body.farmaco,
        dataInizio: mockReq.body.dataInizio,
        numAppuntamenti: mockReq.body.numAppuntamenti,
        frequenzaAppuntamenti: mockReq.body.frequenzaAppuntamenti,
        stato: mockReq.body.stato
      }));
      expect(Terapia.prototype.save).toHaveBeenCalledWith();
  });

  it('Deve restituire 409 come status code e un messaggio di errore se è stato trovato un errore nel salvataggio', async () => {
      const mockError = new Error('Mock save error');
      Terapia.prototype.save.mockRejectedValueOnce(mockError);

      await insertTerapia(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

//Restituire Tutte Le Terapie