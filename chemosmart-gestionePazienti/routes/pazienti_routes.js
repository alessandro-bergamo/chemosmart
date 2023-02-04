const express = require('express')
const {getAllPazienti, insertPaziente, getPazienteByCF, deletePaziente, updatePaziente} = require('../controllers/pazienti_controller.js')
const router = express.Router()

router.get('/', getAllPazienti)

router.post('/', insertPaziente)

router.delete('/:id', deletePaziente)

router.patch('/:id', updatePaziente)

module.exports = router