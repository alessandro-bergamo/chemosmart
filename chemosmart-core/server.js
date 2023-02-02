const express = require('express')
const path = require('path')
const app = express()
const port = 3003
const axios = require('axios')
const bodyParser = require('body-parser')
const { query } = require('express')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))
// switcha il commento per cambiare sidebar visualizzata (usato per testare se tutto va)
let user = 'medico'
// let user = 'infermiere'
//let user = 'segretario'

app.get('/', (req, res) => {
    res.render(__dirname + '/views/loginPage')
})
app.get('/homepage', (req,res) => {
    res.render(__dirname + "/views/index", {user : user})
})

app.post('/login',(req, res) => {
    res.render(__dirname + "/views/index", {user : user})
})

app.get('/infermiere', (req, res) => {
    res.render(__dirname + "/views/homepage-infermiere")
})

app.get('/calendario', (req, res) => {
    res.render(__dirname + "/views/page-calendario")
})

app.get('/medico', (req, res) => {
    res.render(__dirname + "/views/homepage-medico")
})

app.get('/filtri', (req, res) => {
    res.render(__dirname + "/views/filtri", {user : user})
}) 

app.get('/aggiungiTerapia', (req, res) => {
    res.render(__dirname + "/views/aggiungiTerapia")
})

app.post('/addTerapia',(req, res) => {
    axios.post("http://localhost:3050/terapie" , req.body)
    .then(function(response){
         res.send("Terapia Aggiunta")
    })
 })

app.get("/gestioneTerapie", function (req, res) {
    axios.get("http://localhost:3050/terapie").then(function (response) {
        let terapie = response.data;
        res.render(__dirname + "/views/gestioneTerapie", {terapie:terapie});
    });
});


app.get("/modificaTerapia", function (req, res) {
    const id = req.query.id
    axios.get("http://localhost:3050/terapie/"+id).then(function (response) {
        let terapia = response.data;
        res.render(__dirname + "/views/modificaTerapia", {terapia:terapia});
    });
    
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
