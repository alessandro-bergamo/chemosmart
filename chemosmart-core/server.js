const express = require('express')
const path = require('path')
var session = require('express-session')
const app = express()
const port = 3003
const axios = require('axios')
const bodyParser = require('body-parser')
const { query } = require('express')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))

// switcha il commento per cambiare sidebar visualizzata (usato per testare se tutto va)
let user = 'medico'
// let user = 'infermiere'
// let user = 'segretario'

app.use(
    session({
        secret: 'R6RmwcWAH9aHJQCbsLpn',
        resave: true,
        saveUninitialized: true
    })
)

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    res.render(__dirname + '/views/loginPage')
})

app.get('/homepage', (req,res) => {
    res.render(__dirname + "/views/index")
})

app.post('/login',(req, res) => {
    req.session.user = user
    res.render(__dirname + "/views/index")
})

app.get('/homepage', (req,res) => {
    res.render(__dirname + "/views/index")
})


app.get('/infermiere', (req, res) => {
    res.render(__dirname + "/views/homepage-infermiere")
})

app.get('/medico', (req, res) => {
    res.render(__dirname + "/views/homepage-medico")
})

app.get('/filtri', async (req, res) => {
    await axios.get('http://localhost:3007/pazienti')
        .then(function (response) { let pazienti = response.data 
            res.render(__dirname + "/views/filtri", {pazienti: pazienti})
    })
}) 

app.get('/aggiungiTerapia', (req, res) => {
    res.render(__dirname + "/views/aggiungiTerapia")
})

app.post('/addTerapia', (req, res) => {
    axios.post("http://localhost:3050/terapie", req.body)
        .then(function (response) {
            res.send("Terapia Aggiunta")
        })
})

app.get("/gestioneTerapie", function (req, res) {
    axios.get("http://localhost:3050/terapie").then(function (response) {
        let terapie = response.data;
        res.render(__dirname + "/views/gestioneTerapie", { terapie: terapie });
    });
});

//rout per renderizzare pagina modifica terapia
app.get("/modificaTerapia", function (req, res) {
    const id = req.query.id
    axios.get("http://localhost:3050/terapie/" + id).then(function (response) {
        let terapia = response.data;
        res.render(__dirname + "/views/modificaTerapia", { terapia: terapia });
    });

});
//rout per chiamare il backend tramite il submit del form
app.post('/updateTerapia', (req, res) => {
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
                res.send("Terapia Modificata")
            })
    });
})

app.get('/addNewCC', (req,res) => {
    res.render(__dirname + '/views/nuova-cartella-clinica')
})

app.post('/addNewCC', (req,res) => {
    
})

//Route creata da Giuseppe Basile per renderizzare il form aggiungi appuntamento
app.get('/aggiungiAppuntamento', (req, res) => {
    res.render(__dirname + "/views/aggiungiAppuntamento")
}) 

//Route creata da Giuseppe Basile per funzione post per aggiungere appuntamento
app.post('/addAppuntamento',(req, res) => {
   axios.post("http://localhost:3006/appuntamenti" , req.body)
   .then(function(response){
        res.send("Appuntamento Aggiunto")
   })
})

//Route creata da Giuseppe Basile per il calendario
app.get('/calendario', (req, res) => {
    res.render(__dirname + "/views/calendario")
}) 

//rout per visualizzare i farmaci
app.get("/visualizzaFarmaci", function (req, res) {
    axios.get("http://localhost:3001/farmaci").then(function (response) {
        let farmaci = response.data;
        res.render(__dirname + "/views/homepage-infermiere", {farmaci: farmaci});
    });
});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
