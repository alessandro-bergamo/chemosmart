const axios = require('axios')
const timezone = 1

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

function createAppuntamentiTerapia(cf, farmaco, dataInizio, durata, numAppuntamenti, frequenza, priorita) {
    let appuntamenti = []
    let dateInizioAppuntamenti = []
    let dateFineAppuntamenti = []
    let oraInizio

    let strPriorita = JSON.stringify(priorita)
    strPriorita = strPriorita.replace(/"/g,'')
    console.log(strPriorita)
    if(strPriorita == 'Alta'){
        oraInizio = 9
    } else if(strPriorita == 'Media'){
        oraInizio = 13
    } else if(strPriorita == 'Bassa'){
        oraInizio = 18
    }

    for (var i = 0; i < numAppuntamenti; i++){
        dateInizioAppuntamenti[i] = new Date(dataInizio)
        dateFineAppuntamenti[i] = new Date(dataInizio)

        dateInizioAppuntamenti[i].setDate(dateInizioAppuntamenti[i].getDate() + (frequenza*i))
        dateFineAppuntamenti[i].setDate(dateFineAppuntamenti[i].getDate() + (frequenza*i))

        dateInizioAppuntamenti[i].setHours(parseInt(oraInizio))
        dateFineAppuntamenti[i].setHours(parseInt(oraInizio) + parseInt(durata))
        
        appuntamenti[i] = {
            cf: cf,
            farmaco: farmaco,
            dataInizio: dateInizioAppuntamenti[i],
            dataFine: dateFineAppuntamenti[i],
            durata: durata
        }
    }

    return appuntamenti
}

module.exports = {getPazienti, createAppuntamentiTerapia}