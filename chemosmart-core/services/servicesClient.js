const axios = require('axios')

async function getPazienti(){
    try{
        const response = await axios.get('http://localhost:3007/pazienti')
        const pazienti = response.data
        return pazienti
    } catch (error) {
        console.log(error)
        return {error:error.message}
    }
}

async function getPazienti2(){
    try{
        const response = await axios.get('http://localhost:3007/pazienti')
        const pazienti = response.data
        return pazienti
    } catch (error) {
        console.log(error)
        return {error:error.message}
    }
}

module.exports = {getPazienti, getPazienti2}