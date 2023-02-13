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

function createAppuntamentiTerapia(cf, farmaco, dataInizio, oraInizio, durata, numAppuntamenti, frequenza, priorita) {
    let appuntamenti = []
    let dateInizioAppuntamenti = []
    let dateFineAppuntamenti = []
    dateInizioAppuntamenti[0] = new Date(dataInizio)
    dateFineAppuntamenti[0] = new Date(dataInizio)
    console.log(oraInizio)
    dateInizioAppuntamenti[0].setHours(parseInt(oraInizio))
    dateFineAppuntamenti[0].setHours(parseInt(oraInizio) + parseInt(durata))

    for (var i = 1; i < numAppuntamenti; i++){
        dateInizioAppuntamenti[i] = new Date(dataInizio)
        dateFineAppuntamenti[i] = new Date(dataInizio)

        dateInizioAppuntamenti[i].setDate(dateInizioAppuntamenti[i].getDate() + (frequenza*i))
        dateFineAppuntamenti[i].setDate(dateFineAppuntamenti[i].getDate() + (frequenza*i))

        dateInizioAppuntamenti[i].setHours(parseInt(oraInizio))
        dateFineAppuntamenti[i].setHours(parseInt(oraInizio) + parseInt(durata))
        
        // appuntamenti[i] = {
        //     cf: cf,
        //     farmaco: farmaco,
        //     dataInizio : dateAppuntamenti[],
        //     durata: durata,
        // }
    }

    for(var i=0; i < numAppuntamenti; i++){
        console.log("date e ora inizio:" + i + " appuntamento\n" + dateInizioAppuntamenti[i] + '\n')
        console.log("date e ora fine:" + i + " appuntamento\n" + dateFineAppuntamenti[i] + '\n')
    }
    
    return "andato"
}

module.exports = {getPazienti, createAppuntamentiTerapia}