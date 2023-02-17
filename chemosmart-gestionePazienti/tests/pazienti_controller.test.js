//Insert paziente
const Paziente = require("../models/Paziente.js");
const {
  insertPaziente,
  getPazienteById,
  getAllPazienti,
  deletePaziente,
  updatePaziente,
  getPazienteFilter,
} = require("../controllers/pazienti_controller.js");

describe("insertPaziente", () => {
  const mockReq = {
    body: {
      nome: "Giuliana",
      cognome: "Lussu",
      cf: "BQNCZS77C59Z603Z",
      sesso: "F",
      dataNascita: new Date("1970-01-01"),
      eta: 48,
      telefono: "3321459078",
      email: "g.lussu@email.it",
      indice_inquinamento_ambientale: 6,
      indice_uso_alcolici: 7,
      grado_allergia: 7,
      grado_rischio_lavorativo: 7,
      indice_fattori_rischio_familiare: 7,
      indice_malattie_croniche: 6,
      indice_alimentazione_scorretta: 7,
      indice_obesita: 7,
      grado_esposizione_fumo_attivo: 7,
      grado_esposizione_fumo_passivo: 8,
      indice_dolori_localizzati: 7,
      indice_emottisi: 7,
      indice_astenia: 5,
      indice_perdita_peso: 3,
      indice_dispnea: 2,
      indice_respiro_sibilante: 7,
      indice_disfagia: 8,
      stato_dita_di_Ippocrate: 2,
      stato_immunodepressione: 4,
      indice_tosse_secca: 5,
      indice_russamento: 3,
      priorita: "Alta",
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeAll(() => {
    jest.spyOn(Paziente.prototype, "save").mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert a new paziente and return 201 status code", async () => {
    await insertPaziente(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: mockReq.body.nome,
        cognome: mockReq.body.cognome,
        cf: mockReq.body.cf,
        sesso: mockReq.body.sesso,
        dataNascita: mockReq.body.dataNascita,
        eta: mockReq.body.eta,
        telefono: mockReq.body.telefono,
        email: mockReq.body.email,
        indice_inquinamento_ambientale:
          mockReq.body.indice_inquinamento_ambientale,
        indice_uso_alcolici: mockReq.body.indice_uso_alcolici,
        grado_allergia: mockReq.body.grado_allergia,
        grado_rischio_lavorativo: mockReq.body.grado_rischio_lavorativo,
        indice_fattori_rischio_familiare:
          mockReq.body.indice_fattori_rischio_familiare,
        indice_malattie_croniche: mockReq.body.indice_malattie_croniche,
        indice_alimentazione_scorretta:
          mockReq.body.indice_alimentazione_scorretta,
        indice_obesita: mockReq.body.indice_obesita,
        grado_esposizione_fumo_attivo:
          mockReq.body.grado_esposizione_fumo_attivo,
        grado_esposizione_fumo_passivo:
          mockReq.body.grado_esposizione_fumo_passivo,
        indice_dolori_localizzati: mockReq.body.indice_dolori_localizzati,
        indice_emottisi: mockReq.body.indice_emottisi,
        indice_astenia: mockReq.body.indice_astenia,
        indice_perdita_peso: mockReq.body.indice_perdita_peso,
        indice_dispnea: mockReq.body.indice_dispnea,
        indice_respiro_sibilante: mockReq.body.indice_respiro_sibilante,
        indice_disfagia: mockReq.body.indice_disfagia,
        stato_dita_di_Ippocrate: mockReq.body.stato_dita_di_Ippocrate,
        stato_immunodepressione: mockReq.body.stato_immunodepressione,
        indice_tosse_secca: mockReq.body.indice_tosse_secca,
        indice_russamento: mockReq.body.indice_russamento,
        priorita: mockReq.body.priorita,
      })
    );
    expect(Paziente.prototype.save).toHaveBeenCalledWith();
  });

  it("should return 409 status code and error message if there is a save error", async () => {
    const mockError = new Error("Mock save error");
    Paziente.prototype.save.mockRejectedValueOnce(mockError);

    await insertPaziente(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});

//getAllPazienti
describe("getAllPazienti", () => {
  it("dovrebbe restituire tutti i pazienti", async () => {
    const pazienti = [
      { id: "abc123", nome: "Mario", cognome: "Rossi" },
      { id: "def456", nome: "Luigi", cognome: "Verdi" },
    ];
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Paziente, "find").mockResolvedValue(pazienti);
    await getAllPazienti(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(pazienti);
    expect(Paziente.find).toHaveBeenCalled();
  });

  it("dovrebbe restituire una risposta di errore con status 404 se non vengono trovati pazienti", async () => {
    const errorMessage = "Nessun paziente trovato";
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Paziente, "find").mockRejectedValue(new Error(errorMessage));
    await getAllPazienti(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    expect(Paziente.find).toHaveBeenCalled();
  });
});

//getPazienteById
describe("getPazienteById", () => {
  it("deve utilizzare la funzione findById e restituire il paziente il cui id è uguale a quello passato in input", async () => {
    const id = "1234";
    const paziente = [
      {
        id: id,
        nome: "Giuliana",
        cognome: "Lussu",
        cf: "BQNCZS77C59Z603Z",
        sesso: "F",
        dataNascita: "1970-01-01T00:00:00.000Z",
        eta: 48,
        telefono: "3321459078",
        email: "g.lussu@email.it",
        indice_inquinamento_ambientale: 6,
        indice_uso_alcolici: 7,
        grado_allergia: 7,
        grado_rischio_lavorativo: 7,
        indice_fattori_rischio_familiare: 7,
        indice_malattie_croniche: 6,
        indice_alimentazione_scorretta: 7,
        indice_obesita: 7,
        grado_esposizione_fumo_attivo: 7,
        grado_esposizione_fumo_passivo: 8,
        indice_dolori_localizzati: 7,
        indice_emottisi: 7,
        indice_astenia: 5,
        indice_perdita_peso: 3,
        indice_dispnea: 2,
        indice_respiro_sibilante: 7,
        indice_disfagia: 8,
        stato_dita_di_Ippocrate: 2,
        stato_immunodepressione: 4,
        indice_tosse_secca: 5,
        indice_russamento: 3,
        priorita: "Alta",
      },
      {
        id: "abc12345",
        nome: "Marco",
        cognome: "Rossi",
        cf: "YQSCZH77C99Z603Z",
        sesso: "M",
        dataNascita: "1985-01-10T00:00:00.000Z",
        eta: 35,
        telefono: "3421659078",
        email: "m.rossi@email.it",
        indice_inquinamento_ambientale: 4,
        indice_uso_alcolici: 7,
        grado_allergia: 7,
        grado_rischio_lavorativo: 7,
        indice_fattori_rischio_familiare: 7,
        indice_malattie_croniche: 6,
        indice_alimentazione_scorretta: 6,
        indice_obesita: 5,
        grado_esposizione_fumo_attivo: 7,
        grado_esposizione_fumo_passivo: 8,
        indice_dolori_localizzati: 7,
        indice_emottisi: 7,
        indice_astenia: 5,
        indice_perdita_peso: 4,
        indice_dispnea: 2,
        indice_respiro_sibilante: 7,
        indice_disfagia: 8,
        stato_dita_di_Ippocrate: 2,
        stato_immunodepressione: 3,
        indice_tosse_secca: 5,
        indice_russamento: 3,
        priorita: "Media",
      },
    ];
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Paziente, "findById").mockResolvedValueOnce(paziente[0]);
    await getPazienteById(req, res);

    expect(Paziente.findById).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(paziente[0]);
  });

  it("Deve restituire una lista di pazienti vuota se nessun paziente ha id uguale a quello passato in input", async () => {
    const id = "5678";
    const paziente = [
      {
        id: id,
        nome: "Giuliana",
        cognome: "Lussu",
        cf: "BQNCZS77C59Z603Z",
        sesso: "F",
        dataNascita: "1970-01-01T00:00:00.000Z",
        eta: 48,
        telefono: "3321459078",
        email: "g.lussu@email.it",
        indice_inquinamento_ambientale: 6,
        indice_uso_alcolici: 7,
        grado_allergia: 7,
        grado_rischio_lavorativo: 7,
        indice_fattori_rischio_familiare: 7,
        indice_malattie_croniche: 6,
        indice_alimentazione_scorretta: 7,
        indice_obesita: 7,
        grado_esposizione_fumo_attivo: 7,
        grado_esposizione_fumo_passivo: 8,
        indice_dolori_localizzati: 7,
        indice_emottisi: 7,
        indice_astenia: 5,
        indice_perdita_peso: 3,
        indice_dispnea: 2,
        indice_respiro_sibilante: 7,
        indice_disfagia: 8,
        stato_dita_di_Ippocrate: 2,
        stato_immunodepressione: 4,
        indice_tosse_secca: 5,
        indice_russamento: 3,
        priorita: "Alta",
      },
      {
        id: "abc12345",
        nome: "Marco",
        cognome: "Rossi",
        cf: "YQSCZH77C99Z603Z",
        sesso: "M",
        dataNascita: "1985-01-10T00:00:00.000Z",
        eta: 35,
        telefono: "3421659078",
        email: "m.rossi@email.it",
        indice_inquinamento_ambientale: 4,
        indice_uso_alcolici: 7,
        grado_allergia: 7,
        grado_rischio_lavorativo: 7,
        indice_fattori_rischio_familiare: 7,
        indice_malattie_croniche: 6,
        indice_alimentazione_scorretta: 6,
        indice_obesita: 5,
        grado_esposizione_fumo_attivo: 7,
        grado_esposizione_fumo_passivo: 8,
        indice_dolori_localizzati: 7,
        indice_emottisi: 7,
        indice_astenia: 5,
        indice_perdita_peso: 4,
        indice_dispnea: 2,
        indice_respiro_sibilante: 7,
        indice_disfagia: 8,
        stato_dita_di_Ippocrate: 2,
        stato_immunodepressione: 3,
        indice_tosse_secca: 5,
        indice_russamento: 3,
        priorita: "Media",
      },
    ];
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Paziente, "findById").mockResolvedValueOnce([]);
    await getPazienteById(req, res);

    expect(Paziente.findById).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("deve impostare lo stato della chiamata al codice 404 e restiruire messaggio di errore", async () => {
    const id = "abcd";
    const errorMessage = "An error occurred";
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest
      .spyOn(Paziente, "findById")
      .mockRejectedValueOnce(new Error(errorMessage));
    await getPazienteById(req, res);

    expect(Paziente.findById).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

//deletePaziente
describe("deletePaziente", () => {
  test("deve cancellare un Paziente con l'id passato e restituire un messaggio di successo", async () => {
    const id = "123";
    const req = {
      params: {
        id: id,
      },
    };
    const res = {
      json: jest.fn(),
    };
    jest.spyOn(Paziente, "findByIdAndDelete").mockResolvedValueOnce();

    await deletePaziente(req, res);

    expect(Paziente.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith({
      message: "Paziente eliminato con successo",
    });
  });

  test("in caso di Paziente non trovata imposta stato richiesta come 400 e restituisce errore", async () => {
    const id = "123";
    const req = {
      params: {
        id: id,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const errorMessage = "Paziente non trovato";
    jest
      .spyOn(Paziente, "findByIdAndDelete")
      .mockRejectedValueOnce(new Error(errorMessage));

    await deletePaziente(req, res);

    expect(Paziente.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

//updatePaziente
describe("updatePaziente", () => {
  test("deve aggiornare il Paziente tramite l'id ricevuto in input e restituire il Paziente aggiornato", async () => {
    const id = "123";
    const data = {
      nome: "Marco",
      cognome: "Rossi",
      cf: "YQSCZH77C99Z603Z",
      sesso: "M",
      dataNascita: new Date("1970-01-01"),
      eta: 35,
      telefono: "3421659078",
      email: "m.rossi@email.it",
      indice_inquinamento_ambientale: 4,
      indice_uso_alcolici: 7,
      grado_allergia: 7,
      grado_rischio_lavorativo: 7,
      indice_fattori_rischio_familiare: 7,
      indice_malattie_croniche: 6,
      indice_alimentazione_scorretta: 6,
      indice_obesita: 5,
      grado_esposizione_fumo_attivo: 7,
      grado_esposizione_fumo_passivo: 8,
      indice_dolori_localizzati: 7,
      indice_emottisi: 7,
      indice_astenia: 5,
      indice_perdita_peso: 4,
      indice_dispnea: 2,
      indice_respiro_sibilante: 7,
      indice_disfagia: 8,
      stato_dita_di_Ippocrate: 2,
      stato_immunodepressione: 3,
      indice_tosse_secca: 5,
      indice_russamento: 3,
      priorita: "Media",
    };
    const req = {
      params: {
        id: id,
      },
      body: data,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const updatedPaziente = {
      _id: id,
      ...data,
    };
    jest
      .spyOn(Paziente, "findByIdAndUpdate")
      .mockResolvedValueOnce(updatedPaziente);

    await updatePaziente(req, res);

    expect(Paziente.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {
      new: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedPaziente);
  });

  test("Se il Paziente con dato id di input non è presente, deve impostare stato della richiesta a 404 e restituire un messaggio di errore", async () => {
    const id = "123";
    const data = {
      nome: "Marco",
      cognome: "Rossi",
      cf: "YQSCZH77C99Z603Z",
      sesso: "M",
      dataNascita: new Date("1970-01-01"),
      eta: 35,
      telefono: "3421659078",
      email: "m.rossi@email.it",
      indice_inquinamento_ambientale: 4,
      indice_uso_alcolici: 7,
      grado_allergia: 7,
      grado_rischio_lavorativo: 7,
      indice_fattori_rischio_familiare: 7,
      indice_malattie_croniche: 6,
      indice_alimentazione_scorretta: 6,
      indice_obesita: 5,
      grado_esposizione_fumo_attivo: 7,
      grado_esposizione_fumo_passivo: 8,
      indice_dolori_localizzati: 7,
      indice_emottisi: 7,
      indice_astenia: 5,
      indice_perdita_peso: 4,
      indice_dispnea: 2,
      indice_respiro_sibilante: 7,
      indice_disfagia: 8,
      stato_dita_di_Ippocrate: 2,
      stato_immunodepressione: 3,
      indice_tosse_secca: 5,
      indice_russamento: 3,
      priorita: "Media",
    };
    const req = {
      params: {
        id: id,
      },
      body: data,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const errorMessage = "Paziente non trovato";
    jest
      .spyOn(Paziente, "findByIdAndUpdate")
      .mockRejectedValueOnce(new Error(errorMessage));

    await updatePaziente(req, res);

    expect(Paziente.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {
      new: true,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

//getPazienteFilter
describe('getPazienteFilter', () => {
    test('Dovrebbe restiruire il Paziente il cui cfPaziente è uguale al cf passato in input', async () => {
        const nomeQuery = '';
        const cognomeQuery = '';
        const cfQuery = '123';
        const req = {
            query: {
                nome: nomeQuery, cognome: cognomeQuery, cf: cfQuery 
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const Paziente = [
            {
                nome: "Giuliana",
                cognome: "Lussu",
                cf: cf,
                sesso: "F",
                dataNascita: "1970-01-01T00:00:00.000Z",
                eta: 48,
                telefono: "3321459078",
                email: "g.lussu@email.it",
                indice_inquinamento_ambientale: 6,
                indice_uso_alcolici: 7,
                grado_allergia: 7,
                grado_rischio_lavorativo: 7,
                indice_fattori_rischio_familiare: 7,
                indice_malattie_croniche: 6,
                indice_alimentazione_scorretta: 7,
                indice_obesita: 7,
                grado_esposizione_fumo_attivo: 7,
                grado_esposizione_fumo_passivo: 8,
                indice_dolori_localizzati: 7,
                indice_emottisi: 7,
                indice_astenia: 5,
                indice_perdita_peso: 3,
                indice_dispnea: 2,
                indice_respiro_sibilante: 7,
                indice_disfagia: 8,
                stato_dita_di_Ippocrate: 2,
                stato_immunodepressione: 4,
                indice_tosse_secca: 5,
                indice_russamento: 3,
                priorita: "Alta",
              },
              {
                nome: "Marco",
                cognome: "Rossi",
                cf: "YQSCZH77C99Z603Z",
                sesso: "M",
                dataNascita: "1985-01-10T00:00:00.000Z",
                eta: 35,
                telefono: "3421659078",
                email: "m.rossi@email.it",
                indice_inquinamento_ambientale: 4,
                indice_uso_alcolici: 7,
                grado_allergia: 7,
                grado_rischio_lavorativo: 7,
                indice_fattori_rischio_familiare: 7,
                indice_malattie_croniche: 6,
                indice_alimentazione_scorretta: 6,
                indice_obesita: 5,
                grado_esposizione_fumo_attivo: 7,
                grado_esposizione_fumo_passivo: 8,
                indice_dolori_localizzati: 7,
                indice_emottisi: 7,
                indice_astenia: 5,
                indice_perdita_peso: 4,
                indice_dispnea: 2,
                indice_respiro_sibilante: 7,
                indice_disfagia: 8,
                stato_dita_di_Ippocrate: 2,
                stato_immunodepressione: 3,
                indice_tosse_secca: 5,
                indice_russamento: 3,
                priorita: "Media",
              }
        ]
        jest.spyOn(Paziente, 'find').mockResolvedValueOnce(Paziente[0])

        await getPazienteFilter(req, res)

        expect(Paziente.find).toHaveBeenCalledWith({ nome: { $regex: new RegExp("^" + nomeQuery.toLowerCase(), "i")}, cognome: {$regex: new RegExp("^" + cognomeQuery.toLowerCase(), "i")}, cf: {$regex: new RegExp("^" + cfQuery.toLowerCase(), "i")}}.exec())
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(Paziente[0])
    })

    test('Dovrebbe restituire un array di Paziente vuoto se nessun Paziente ha come cfPaziente il cf passato in input', async () => {
        const nomeQuery = '';
        const cognomeQuery = '';
        const cfQuery = '123';
        const req = {
            query: {
                nome: nomeQuery, cognome: cognomeQuery, cf: cfQuery 
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const Paziente = [
            {
                nome: "Giuliana",
                cognome: "Lussu",
                cf: "789",
                sesso: "F",
                dataNascita: "1970-01-01T00:00:00.000Z",
                eta: 48,
                telefono: "3321459078",
                email: "g.lussu@email.it",
                indice_inquinamento_ambientale: 6,
                indice_uso_alcolici: 7,
                grado_allergia: 7,
                grado_rischio_lavorativo: 7,
                indice_fattori_rischio_familiare: 7,
                indice_malattie_croniche: 6,
                indice_alimentazione_scorretta: 7,
                indice_obesita: 7,
                grado_esposizione_fumo_attivo: 7,
                grado_esposizione_fumo_passivo: 8,
                indice_dolori_localizzati: 7,
                indice_emottisi: 7,
                indice_astenia: 5,
                indice_perdita_peso: 3,
                indice_dispnea: 2,
                indice_respiro_sibilante: 7,
                indice_disfagia: 8,
                stato_dita_di_Ippocrate: 2,
                stato_immunodepressione: 4,
                indice_tosse_secca: 5,
                indice_russamento: 3,
                priorita: "Alta",
              },
              {
                nome: "Marco",
                cognome: "Rossi",
                cf: "YQSCZH77C99Z603Z",
                sesso: "M",
                dataNascita: "1985-01-10T00:00:00.000Z",
                eta: 35,
                telefono: "3421659078",
                email: "m.rossi@email.it",
                indice_inquinamento_ambientale: 4,
                indice_uso_alcolici: 7,
                grado_allergia: 7,
                grado_rischio_lavorativo: 7,
                indice_fattori_rischio_familiare: 7,
                indice_malattie_croniche: 6,
                indice_alimentazione_scorretta: 6,
                indice_obesita: 5,
                grado_esposizione_fumo_attivo: 7,
                grado_esposizione_fumo_passivo: 8,
                indice_dolori_localizzati: 7,
                indice_emottisi: 7,
                indice_astenia: 5,
                indice_perdita_peso: 4,
                indice_dispnea: 2,
                indice_respiro_sibilante: 7,
                indice_disfagia: 8,
                stato_dita_di_Ippocrate: 2,
                stato_immunodepressione: 3,
                indice_tosse_secca: 5,
                indice_russamento: 3,
                priorita: "Media",
              }
        ]
        jest.spyOn(Paziente, 'find').mockResolvedValueOnce([])

        await getPazienteFilter(req, res)

        expect(Paziente.find).toHaveBeenCalledWith({ nome: { $regex: new RegExp("^" + nomeQuery.toLowerCase(), "i")}, cognome: {$regex: new RegExp("^" + cognomeQuery.toLowerCase(), "i")}, cf: {$regex: new RegExp("^" + cfQuery.toLowerCase(), "i")}}.exec())
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([])
    })

    test('Dovrebbe impostare lo stato della richiesta al codice 404 e restituire un messaggio di errore in caso di errore nella ricerca dei Pazienti', async () => {
        const nomeQuery = '';
        const cognomeQuery = '';
        const cfQuery = '123';
        const req = {
            query: {
                nome: nomeQuery, cognome: cognomeQuery, cf: cfQuery 
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const errorMessage = 'Errore durante il recupero dei pazienti'
        jest.spyOn(Paziente, 'find').mockRejectedValueOnce(new Error(errorMessage))

        await getPazienteFilter(req, res)

        expect(Paziente.find).toHaveBeenCalledWith({ nome: { $regex: new RegExp("^" + nomeQuery.toLowerCase(), "i")}, cognome: {$regex: new RegExp("^" + cognomeQuery.toLowerCase(), "i")}, cf: {$regex: new RegExp("^" + cfQuery.toLowerCase(), "i")}}.exec())
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage })
    })
})




