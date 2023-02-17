process.env.TZ = 'UTC'
const express = require('express')
const path = require('path')
var session = require('express-session')
const app = express()
const port = 3003
const axios = require('axios')
const bodyParser = require('body-parser')
const converter = require('json-2-csv')
const fs = require('fs')
const { spawn } = require('child_process');
const api = require('./services/servicesClient.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/ml', express.static(path.resolve("../modello_FIA/")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))

// switcha il commento per cambiare sidebar visualizzata (usato per testare se tutto va)
// let user = 'Medico'
// let user = 'Infermiere'
// let user = 'Segretario'

app.use(
    session({
        secret: 'R6RmwcWAH9aHJQCbsLpn',
        resave: true,
        saveUninitialized: true
    })
)

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect('/homepage')
    } else {
        res.render(__dirname + '/views/loginPage')
    }
})

app.post('/login', (req, res) => {
    if (req.session.loggedIn != true) {
        req.session.user = req.body.user_type
        req.session.loggedIn = true
    }

    if (req.session.user == "Infermiere") {
        res.redirect('/visualizzaFarmaci')
    } else {
        res.redirect('/homepage')
    }

})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/homepage', async (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect('/')
    } else {
        if (req.session.user == 'Infermiere') {
            res.redirect('/visualizzaFarmaci')
        } else {
            try {
                const pazienti = await api.getPazienti()
                res.status(201).render(__dirname + "/views/index", { pazienti: pazienti })
            } catch (error) {
                res.status(404).render('/')
            }
        }
    }
})

app.get('/filtri', async (req, res) => {
    console.log(req.session.loggedIn)
    console.log(req.session.user)
    if (req.session.loggedIn != true) {
        res.redirect('/')
    } else if (req.session.user != 'Medico' && req.session.user != 'Segretario') {
        res.redirect('/homepage')
    } else {
        try {
            const pazienti = await api.getPazienti()
            res.status(201).render(__dirname + "/views/filtri", { pazienti: pazienti })
        } catch (error) {
            res.status(404).render('/')
        }
    }
})

app.get('/aggiungiTerapia', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        res.render(__dirname + "/views/aggiungiTerapia")
    }
})

app.post('/addTerapia', async (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/');
    } else {
        try {
            const result = await api.aggiungiTerapia(req.body);
            res.send("Terapia Aggiunta");
        } catch (error) {
            console.error(error);
            res.status(500).send("Errore nell'aggiunta della terapia");
        }
    }
});

app.get("/gestioneTerapie", async (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/');
    } else {
        const terapie = await api.getTerapie();
        if (terapie) {
            res.render(__dirname + "/views/gestioneTerapie", { terapie: terapie });
        } else {
            res.status(500).send("Errore nel recupero delle terapie");
        }
    }
});

//route per renderizzare pagina modifica terapia
app.get("/modificaTerapia", async (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/');
    } else {
        const id = req.query.id;
        try {
            const terapia = await api.getTerapiaById(id);
            res.render(__dirname + "/views/modificaTerapia", { terapia: terapia });
        } catch (error) {
            console.error(error);
            res.status(500).send("Errore nel recupero della terapia");
        }
    }
});

//route per chiamare il backend tramite il submit del form
app.post('/updateTerapia', async (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/');
    } else {
        const id = req.body.id;
        try {
            const terapia = await api.getTerapiaById(id);
            const dato = {
                cfPaziente: req.body.cfPaziente || terapia.cfPaziente,
                farmaco: req.body.farmaco || terapia.farmaco,
                dataInizio: req.body.dataInizio || terapia.dataInizio,
                numAppuntamenti: req.body.numAppuntamenti || terapia.numAppuntamenti,
                frequenzaAppuntamenti: Number.isInteger(parseInt(req.body.frequenzaAppuntamenti)) ? parseInt(req.body.frequenzaAppuntamenti) : terapia.frequenzaAppuntamenti
            };

            await api.updateTerapia(id, dato);
            const terapie = await api.getTerapie();
            res.render(__dirname + "/views/gestioneTerapie", { terapie: terapie });
        } catch (error) {
            console.error(error);
            res.status(500).send("Errore nell'aggiornamento della terapia");
        }
    }
});

//rout per renderizzare pagina modifica appuntamento
app.get("/modificaAppuntamento", async function (req, res){
    const id = req.query.id;
    try {
        const response = await api.getAppuntamentoById(id)
        const appuntamento = response.data;
        res.render(__dirname + "/views/modificaAppuntamento", { appuntamento: appuntamento });
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore nella modifica dell'appuntamento");
    }
});

//rout per chiamare il backend tramite il submit del form
app.post('/updateAppuntamento', async (req, res) => {
    const id = req.body.id;
    try {
        const appuntamento = await api.getAppuntamentoById(id);
        const dato = {
            cfPaziente: req.body.cfPaziente || appuntamento.cfPaziente,
            farmaco: req.body.farmaco || appuntamento.farmaco,
            dataInizio: req.body.dataInizio || appuntamento.dataInizio,
            dataFine: req.body.dataFine || appuntamento.dataFine,
            durata: req.body.durata || appuntamento.durata
        };
        await api.updateAppuntamento(id, dato);
        res.render("calendario");
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore nell'aggiornamento dell'appuntamento");
    }
});

app.get('/addNewCC', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        res.render(__dirname + '/views/nuova-cartella-clinica')
    }

})

app.post('/addNewCC', (req, res) => {
    //da completare in future release
})

//Route creata da Giuseppe Basile per funzione post per aggiungere appuntamento
app.post('/addAppuntamento', async (req, res) => {
    try {
        if (req.session.loggedIn != true || req.session.user != 'Medico') {
            res.redirect('/')
        } else {
            const response = await api.addAppuntamento(req.body);
            res.render(__dirname + "/views/calendario");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

//Route creata da Giuseppe Basile per il calendario
app.get('/calendario', (req, res) => {
    res.render(__dirname + "/views/calendario", { user: req.session.user })
})

//route per visualizzare i farmaci
app.get("/visualizzaFarmaci", async function (req, res) {
    try {
        const response = await api.getFarmaci();
        const farmaci = response.data;
        res.render(__dirname + "/views/homepage-infermiere", { farmaci: farmaci });
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore durante la lettura dei dati dei farmaci.");
    }
});

app.get('/schedulaTerapia', async (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect('/')
    } else {
        try {
            const pazienti = await api.getPazienti()
            res.render(__dirname + "/views/schedulaTerapia", { pazienti: pazienti })
        } catch (error) {
            console.error(error);
            res.status(500).send("Errore durante la lettura dei dati dei pazienti.");
        }
    }
})

app.post('/getPriorita', async (req, res, next) => {
    const id = req.body.id
    const cf = req.body.cf

    try {
        await axios.get('http://localhost:3007/pazienti/' + id)
            .then(function (response) {
                let paziente = response.data

                converter.json2csv(paziente, (err, csv) => {
                    if (err) {
                        throw err
                    }

                    try {
                        fs.writeFile('../modello_FIA/patient_to_predict.csv', csv, (err, data) => {
                            if (err) {
                                console.log(err)
                                return;
                            }

                            let priorita
                            const python = spawn("python", ["../modello_FIA/ml_predict.py", "../modello_FIA/patient_to_predict.csv"])

                            python.stdout.on("data", function (data) {
                                priorita = data.toString()
                            })

                            python.on("close", async (code) => {
                                await axios.get('http://localhost:3050/terapie/filter?cf=' + cf).then(function (response) {
                                    const terapie = response.data

                                    res.render(__dirname + "/views/schedulazione", { idPaziente: paziente._id, nome: paziente.nome, cognome: paziente.cognome, priorita: priorita, terapie: terapie })
                                })

                            })
                        })
                    } catch (err) {
                        console.log(err)
                    }
                })
            })
    } catch (err) {
        throw err
    }


})

app.post("/generateAppuntamenti", async (req, res) => {
    const numAppuntamenti = req.body.numAppuntamenti
    const idPaziente = req.body.idPaziente
    const idTerapia = req.body.idTerapia
    const frequenza = req.body.frequenza
    const dataInizio = req.body.dataInizio
    const cf = req.body.cf
    const nome = req.body.nome
    const cognome = req.body.cognome
    const farmaco = req.body.farmaco
    const durata = req.body.durata
    const priorita = req.body.priorita
    const stato = 'In corso'

    try {
        const appuntamenti = await api.createAppuntamentiTerapia(cf, nome, cognome, farmaco, dataInizio, durata, numAppuntamenti, frequenza, priorita)
        const terapia = await api.startTerapia(idTerapia, dataInizio, stato)
        const paziente = await api.updatePaziente(idPaziente, priorita)
        res.status(201).json(appuntamenti)
    } catch (error) {
        res.status(505).send(error.message)
    }


})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
