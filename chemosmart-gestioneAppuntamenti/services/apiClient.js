const axios = require('axios')
const { model } = require('mongoose')

async function getPaziente(cf) {
    try{
        const response = axios.get('http://localhost:3007/pazienti/getPaziente/' + cf)
        return response
    } catch(err){
        return err.message
    }
}

async function getFarmaco(nome) {
    try {
        const response = axios.get('http://localhost:3001/farmaci/getFarmaco/' + nome)

        return response
    } catch (error) {
        return error.message
    }
}
module.exports = {getPaziente, getFarmaco}