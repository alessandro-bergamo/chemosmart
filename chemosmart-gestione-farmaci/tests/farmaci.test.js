const { updateFarmaco } = require('../controllers/farmaci')
const Farmaco = require('../models/farmaco')

jest.mock('../models/farmaco');

/*Restituisce Farmaco Aggiornato

Author: Claudio de Palma

Description:
[TC_3.1_1] Il Farmaco non è presente nel database: questo test verifica il comportamento della funzione quando il farmaco che si intende aggiornare non è presente nel database. 
In questo caso, la funzione deve restituire uno stato HTTP 400 con un messaggio che indica che il farmaco non è stato trovato.
[TC_3.1_2] Il parametro stock non è valido: questo test verifica il comportamento della funzione quando il parametro "stock" del farmaco è un valore negativo. 
In questo caso, la funzione deve restituire uno stato HTTP 400 con un messaggio che indica che il parametro stock non è valido.
[TC_3.1_3] L'aggiornamento avviene con successo: questo test verifica il comportamento della funzione quando l'aggiornamento del farmaco avviene correttamente. 
In questo caso, la funzione deve restituire uno stato HTTP 200 con il farmaco aggiornato come corpo della risposta.
*/

describe('updateFarmaco', () => {
    it('[TC_3.1_1] Il Farmaco non è presente nel database', async () => {
        const id = '123';
        const req = { params: { id }, body: { name: 'Aspirina', stock: 10 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Farmaco.findById.mockResolvedValue(null);

        await updateFarmaco(req, res);

        expect(Farmaco.findById).toHaveBeenCalledWith(id);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Farmaco non trovato');
    });

    it('[TC_3.1_2] Il parametro stock non è valido', async () => {
        const id = '123';
        const req = { params: { id }, body: { name: 'Aspirina', stock: -1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockFarmaco = { _id: id, name: 'Aspirina', stock: 10 };
        Farmaco.findById.mockResolvedValue(mockFarmaco);

        await updateFarmaco(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Stock negativo');
    });

    it('[TC_3.1_3] L\'aggiornamento avviene con successo', async () => {
        const id = '123';
        const req = { params: { id }, body: { name: 'Aspirina', stock: 10 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockFarmaco = { _id: id, name: 'Aspirina', stock: 10 };
        Farmaco.findById.mockResolvedValue(mockFarmaco);
        Farmaco.findByIdAndUpdate.mockResolvedValue(mockFarmaco);

        await updateFarmaco(req, res);

        expect(Farmaco.findById).toHaveBeenCalledWith(id);
        expect(Farmaco.findByIdAndUpdate).toHaveBeenCalledWith(id, req.body, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockFarmaco);
    });
});