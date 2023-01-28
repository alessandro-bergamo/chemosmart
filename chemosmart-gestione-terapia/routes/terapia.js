const express = require('express')
const Terapia = require("../models/terapia.js")

const router =  express.Router()

router.get('/', async (req, res)=>{
    
    try {
        const terapie=await Terapia.find()
        console.log(terapie)
        //await terapia.save()
        res.send(terapie)

    } catch (error) {
        
    }

})
router.post('/', async (req, res)=>{
    const terapia = new Terapia({
        farmaco:"Tachipirina",
        dataInizio:120123,
        frequenzaAppuntamenti:2,
        cfPazinete:"CNNDHFJE355"

    })
    try {
        
        await terapia.save()
        res.send(terapie)

    } catch (error) {
        
    }
    
})

router.get('/:cf', (req, res)=>{
    res.send("route Tutte Terapie id 2")
    

})

module.exports = router



