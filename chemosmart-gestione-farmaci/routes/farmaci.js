const express = require('express')
const {getAllFarmaci} = require('../controller/farmaci.js');
const router = express.Router()

router.get('/', getAllFarmaci)
/* router.get('/:id', getAllFarmaciById)
router.get('/:stock', getAllFarmaciByStock) */


module.exports = router