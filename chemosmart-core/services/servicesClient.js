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
            appuntamenti[i] = await createAppuntamento(cf, farmaco, dateInizioAppuntamenti[i], dateFineAppuntamenti[i])
        } catch (error) {
            return error
        }
    }

    return appuntamenti
}

async function createAppuntamento(cf, farmaco, dataInizio, dataFine) {
    try {
        const appuntamento = await axios.post('http://localhost:3006/appuntamenti/', {
            cfPaziente: cf,
            farmaco: farmaco,
            dataInizio: dataInizio,
            dataFine: dataFine
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

async function startTerapia(id,dataInizio, stato) {
    const data = new Date(dataInizio)
    try {
        const terapia = await axios.patch('http://localhost:3050/terapie/' + id, {dataInizio: data, stato: stato })
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

async function getTerapiaById(id) {
    try {
        const response = await axios.get("http://localhost:3050/terapie/" + id);
        const terapia = response.data;
        return terapia;
    } catch (error) {
        console.error(error);
        throw new Error("Errore nel recupero della terapia");
    }
}

async function updateTerapia(id, dato) {
    try {
        const response = await axios.patch("http://localhost:3050/terapie/" + id, dato);
        return response.data;
    } catch (error) {
        throw new Error(`Errore nella chiamata axios: ${error.message}`);
    }
}

async function getAppuntamentoById(id) {
    return axios.get("http://localhost:3006/appuntamenti/" + id);
}

async function updateAppuntamento(id, data) {
    await axios.patch("http://localhost:3006/appuntamenti/" + id, data);
}

async function addAppuntamento(appuntamento) {
    try {
        const response = await axios.post("http://localhost:3006/appuntamenti", appuntamento);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getFarmaci() {
    const response = await axios.get("http://localhost:3001/farmaci");
    return response;
}

module.exports = { getPazienti, createAppuntamentiTerapia, updatePaziente, updateTerapia, aggiungiTerapia, getTerapie, getTerapiaById, getAppuntamentoById, updateAppuntamento, addAppuntamento, getFarmaci, startTerapia }