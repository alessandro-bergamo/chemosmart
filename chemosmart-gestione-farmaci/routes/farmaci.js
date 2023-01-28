const express = require('express')
const {getAllFarmaci, insertFarmaco, getFarmacoById} = require('../controllers/farmaci.js');
const router = express.Router()

router.get('/', getAllFarmaci)

router.post('/', insertFarmaco)

 router.get('/:id', getFarmacoById)
 /*
router.get('/:stock', getAllFarmaciByStock) */


module.exports = router