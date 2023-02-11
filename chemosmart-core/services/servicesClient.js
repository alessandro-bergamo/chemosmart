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

function createAppuntamentiTerapia(data) {
    console.log("data inizio " + data.dataInizio)
    console.log("frequenza " + data.frequenza)
    console.log("numAppuntamenti " + data.numAppuntamenti)
    let appuntamenti = []
    for (var i; i < numAppuntamenti; i++){
        // appuntamenti[i] forse va usato un costruttore tipo create Appuntamento o na cosa cosi scritta nel ms appuntamento
    }

    return "andato"
}

module.exports = {getPazienti, createAppuntamentiTerapia}