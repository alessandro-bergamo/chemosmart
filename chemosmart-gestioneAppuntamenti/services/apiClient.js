const axios = require('axios')
const { model } = require('mongoose')

async function getPaziente(cf) {
    try{
        const response = axios.get('http://localhost:3007/pazienti/getPaziente/' + cf)

        return response.data
    } catch(err){
        return err.message
    }
}

async function getFarmaco(nome) {
    try {
        const response = axios.get('http://localhost:3001/farmaci/getFarmaco/' + nome)

        return response.data
    } catch (error) {
        return error.message
    }
}
module.exports = {getPaziente, getFarmaco}