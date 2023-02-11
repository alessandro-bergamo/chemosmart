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

function createAppuntamentiTerapia(dataInizio, numAppuntamenti, frequenza) {
    console.log("data inizio " + dataInizio)
    console.log("frequenza " + frequenza)
    console.log("numAppuntamenti " + numAppuntamenti)
    let appuntamenti = []
    let dateAppuntamenti = []
    dateAppuntamenti[0] = new Date(dataInizio)
    for (var i = 1; i < numAppuntamenti; i++){
        dateAppuntamenti[i] = new Date(dataInizio)
        dateAppuntamenti[i].setDate(dateAppuntamenti[i].getDate() + (frequenza*i))
        // appuntamenti[i] forse va usato un costruttore tipo create Appuntamento o na cosa cosi scritta nel ms appuntamento
    }
    console.log(dateAppuntamenti)
    return "andato"
}

module.exports = {getPazienti, createAppuntamentiTerapia}