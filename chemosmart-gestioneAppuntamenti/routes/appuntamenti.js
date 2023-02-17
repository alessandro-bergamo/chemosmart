const express = require('express')
const {getAllAppuntamenti, insertAppuntamento, getAppuntamentoById, deleteAppuntamento, updateAppuntamento, createAppuntamento} = require('../controllers/appuntamenti.js');
const router = express.Router()

router.get('/', getAllAppuntamenti)

router.post('/', insertAppuntamento)

router.post('/createAppuntamento', createAppuntamento)

router.get('/:id', getAppuntamentoById)

router.delete('/:id', deleteAppuntamento)

router.patch('/:id',updateAppuntamento)

module.exports = router


