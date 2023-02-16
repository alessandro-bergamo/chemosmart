const axios = require('axios')
process.env.TZ = 'UTC'

async function getPazienti() {
    try {
        const response = await axios.get('http://localhost:3007/pazienti')
        const pazienti = response.data
        return pazienti
    } catch (error) {
        console.log(error)
        return { error: error.message }
    }
}

async function createAppuntamentiTerapia(cf, farmaco, dataInizio, durata, numAppuntamenti, frequenza, priorita) {
    let appuntamenti = []
    let dateInizioAppuntamenti = []
    let dateFineAppuntamenti = []
    let oraInizio

    let strPriorita = JSON.stringify(priorita)
    strPriorita = strPriorita.replace(/"/g, '')
    console.log(strPriorita)
    if (strPriorita == 'Alta') {
        oraInizio = 9
    } else if (strPriorita == 'Media') {
        oraInizio = 13
    } else if (strPriorita == 'Bassa') {
        oraInizio = 18
    }

    for (var i = 0; i < numAppuntamenti; i++) {
        dateInizioAppuntamenti[i] = new Date(dataInizio)
        dateFineAppuntamenti[i] = new Date(dataInizio)

        dateInizioAppuntamenti[i].setDate(dateInizioAppuntamenti[i].getDate() + (frequenza * i))
        dateFineAppuntamenti[i].setDate(dateFineAppuntamenti[i].getDate() + (frequenza * i))

        dateInizioAppuntamenti[i].setHours(parseInt(oraInizio))
        dateFineAppuntamenti[i].setHours(parseInt(oraInizio) + parseInt(durata))

        try {
            appuntamenti[i] = await createAppuntamento(cf, farmaco, dateInizioAppuntamenti[i], dateFineAppuntamenti[i], durata)
        } catch (error) {
            return error
        }
    }

    return appuntamenti
}

async function createAppuntamento(cf, farmaco, dataInizio, dataFine, durata) {
    try {
        const appuntamento = await axios.post('http://localhost:3006/appuntamenti/', {
            cfPaziente: cf,
            farmaco: farmaco,
            dataInizio: dataInizio,
            dataFine: dataFine,
            durata: durata
        })

        return appuntamento.data
    } catch (error) {
        return error
    }
}

async function updatePaziente(id, priorita) {
    try {
        const paziente = await axios.patch('http://localhost:3007/pazienti/' + id, { priorita: priorita })

        return paziente
    } catch (error) {
        return error
    }
}

async function updateTerapia(id, stato) {
    try {
        const terapia = await axios.patch('http://localhost:3050/terapie/' + id, { stato: stato })

        return terapia
    } catch (error) {
        return error
    }
}

async function aggiungiTerapia(body) {
    try {
        const response = await axios.post("http://localhost:3050/terapie", body);
        return response.data;
    } catch (error) {
        throw new Error(`Errore nella chiamata axios: ${error.message}`);
    }
}

async function getTerapie() {
    try {
        const response = await axios.get("http://localhost:3050/terapie");
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { getPazienti, createAppuntamentiTerapia, updatePaziente, updateTerapia, aggiungiTerapia, getTerapie }