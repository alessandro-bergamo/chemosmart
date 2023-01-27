const express = require('express')

let farmaci = []

//controller per restituire tutti i farmaci
exports.getAllFarmaci = (req,res) => {
    res.send('sono nei farmaci get')
    
}