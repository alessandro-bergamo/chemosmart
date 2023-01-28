const express = require('express')
const {getAllFarmaci, insertFarmaco, getFarmaciById} = require('../controllers/farmaci.js');
const router = express.Router()

router.get('/', getAllFarmaci)

router.post('/', insertFarmaco)

 router.get('/:id', getFarmaciById)
 /*
router.get('/:stock', getAllFarmaciByStock) */


module.exports = router