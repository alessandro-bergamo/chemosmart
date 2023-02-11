const express = require('express')
const path = require('path')
var session = require('express-session')
const app = express()
const port = 3003
const axios = require('axios')
const bodyParser = require('body-parser')
const converter = require('json-2-csv')
const fs = require('fs')
const {spawn} = require('child_process');
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
            try{
                const pazienti = await api.getPazienti()
                res.status(201).render(__dirname + "/views/index", {pazienti: pazienti})
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
        await axios.get('http://localhost:3007/pazienti')
            .then(function (response) {
                let pazienti = response.data
                res.render(__dirname + "/views/filtri", { pazienti: pazienti })
            })
    }
})

app.get('/aggiungiTerapia', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        res.render(__dirname + "/views/aggiungiTerapia")
    }
})

app.post('/addTerapia', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        axios.post("http://localhost:3050/terapie", req.body)
            .then(function (response) {
                res.send("Terapia Aggiunta")
            })
    }
})

app.get("/gestioneTerapie", function (req, res) {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        axios.get("http://localhost:3050/terapie").then(function (response) {
            let terapie = response.data;
            res.render(__dirname + "/views/gestioneTerapie", { terapie: terapie });
        });
    }
});

//route per renderizzare pagina modifica terapia
app.get("/modificaTerapia", function (req, res) {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        const id = req.query.id
        axios.get("http://localhost:3050/terapie/" + id).then(function (response) {
            let terapia = response.data;
            res.render(__dirname + "/views/modificaTerapia", { terapia: terapia });
        });
    }
});

//route per chiamare il backend tramite il submit del form
app.post('/updateTerapia', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        const id = req.body.id
        axios.get("http://localhost:3050/terapie/" + id).then(function (response) {
            let terapia = response.data;

            dato = {
                cfPaziente: req.body.cfPaziente || terapia.cfPaziente,
                farmaco: req.body.farmaco || terapia.farmaco,
                dataInizio: req.body.dataInizio || terapia.dataInizio,
                frequenzaAppuntamenti: req.body.frequenzaAppuntamenti || terapia.frequenzaAppuntamenti
            }
            axios.patch("http://localhost:3050/terapie/" + id, dato)
                .then(function (response) {
                    axios.get("http://localhost:3050/terapie").then(function (response) {
                        let terapie = response.data;
                        res.render(__dirname + "/views/gestioneTerapie", { terapie: terapie });
                    });
                })
        });
    }
})

//rout per renderizzare pagina modifica appuntamento
app.get("/modificaAppuntamento", function (req, res) {
    const id = req.query.id
    axios.get("http://localhost:3006/appuntamenti/" + id).then(function (response) {
        let appuntamento = response.data;
        res.render(__dirname + "/views/modificaAppuntamento", { appuntamento: appuntamento });
    });

});

//rout per chiamare il backend tramite il submit del form
app.post('/updateAppuntamento', (req, res) => {
    const id = req.body.id
    axios.get("http://localhost:3006/appuntamenti/" + id).then(function (response) {
        let appuntamento = response.data;

        dato = {
            cfPaziente: req.body.cfPaziente || appuntamento.cfPaziente,
            farmaco: req.body.farmaco || appuntamento.farmaco,
            dataInizio: req.body.dataInizio || appuntamento.dataInizio,
            dataFine: req.body.dataFine || appuntamento.dataFine
        }
        axios.patch("http://localhost:3006/appuntamenti/" + id, dato)
            .then(function (response) {
                res.render("calendario")
            })
    });
})

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

//Route creata da Giuseppe Basile per renderizzare il form aggiungi appuntamento
app.get('/aggiungiAppuntamento', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        res.render(__dirname + "/views/aggiungiAppuntamento")
    }

})

//Route creata da Giuseppe Basile per funzione post per aggiungere appuntamento
app.post('/addAppuntamento', (req, res) => {
    if (req.session.loggedIn != true || req.session.user != 'Medico') {
        res.redirect('/')
    } else {
        axios.post("http://localhost:3006/appuntamenti", req.body)
            .then(function (response) {
                res.render(__dirname + "/views/calendario")
            })
    }

})

//Route creata da Giuseppe Basile per il calendario
app.get('/calendario', (req, res) => {
    res.render(__dirname + "/views/calendario")
})

//route per visualizzare i farmaci
app.get("/visualizzaFarmaci", function (req, res) {
    axios.get("http://localhost:3001/farmaci").then(function (response) {
        let farmaci = response.data;
        res.render(__dirname + "/views/homepage-infermiere", { farmaci: farmaci });
    });
});

app.get('/schedulaTerapia', async (req, res) => {
    if (req.session.loggedIn != true) {
        res.redirect('/')
    } else {
        await axios.get('http://localhost:3007/pazienti')
            .then(function (response) {
                let pazienti = response.data
                res.render(__dirname + "/views/schedulaTerapia", { pazienti: pazienti })
            })
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
                                    
                                    res.render(__dirname + "/views/schedulazione", { priorita: priorita, terapie: terapie })
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

app.post("/generateAppuntamenti", (req,res) => {
    const numAppuntamenti = req.body.numAppuntamenti
    const frequenza = req.body.frequenza
    const dataInizio = req.body.dataInizio

    appuntamenti = api.createAppuntamentiTerapia(dataInizio,numAppuntamenti,frequenza)

    res.status(201).json(appuntamenti)
})
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
