const express = require('express')
const {getAllFarmaci, insertFarmaco, getFarmacoById, deleteFarmaco, updateFarmaco, getFarmacoByNome} = require('../controllers/farmaci.js');
const router = express.Router()

router.get('/', getAllFarmaci)

router.post('/', insertFarmaco)

router.get('/:id', getFarmacoById)

router.delete('/:id', deleteFarmaco)

router.patch('/:id',updateFarmaco)

router.get('/getFarmaco/:nome', getFarmacoByNome) 


module.exports = router