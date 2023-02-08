const express = require('express')
const {getAllPazienti, insertPaziente, getPazienteById, deletePaziente, updatePaziente, getPazienteFilter} = require('../controllers/pazienti_controller.js')
const router = express.Router()

router.get('/filter', getPazienteFilter)

router.get('/', getAllPazienti)

router.post('/', insertPaziente)

router.get('/:id', getPazienteById)

router.delete('/:id', deletePaziente)

router.patch('/:id', updatePaziente)


module.exports = router