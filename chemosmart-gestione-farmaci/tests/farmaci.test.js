const { updateFarmaco } = require('../controllers/farmaci')
const Farmaco = require('../models/farmaco')

jest.mock('../models/farmaco');

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