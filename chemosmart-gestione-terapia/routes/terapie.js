const express = require('express')
const {getAllTerapie, insertTerapia, getTerapiaById, deleteTerapia, updateTerspia} = require('../controllers/terapie.js');
const router = express.Router()

router.get('/', getAllTerapie)

router.post('/', insertTerapia)

router.get('/:id', getTerapiaById)

router.delete('/:id', deleteTerapia)

router.patch('/:id',updateTerspia)

module.exports = router



