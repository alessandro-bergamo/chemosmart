const express = require('express')
const {getAllPazienti, insertPaziente, getPazienteById, deletePaziente, updatePaziente, getPazienteFilter, getPazienteByCf} = require('../controllers/pazienti_controller.js')
const router = express.Router()

router.get('/filter', getPazienteFilter)

router.get('/', getAllPazienti)

router.post('/', insertPaziente)

router.get('/:id', getPazienteById)

router.delete('/:id', deletePaziente)

router.patch('/:id', updatePaziente)

router.get('/getPaziente/:cf', getPazienteByCf)


module.exports = router