const express = require('express')
const path = require('path')
const app = express()
const port = 3001
const axios = require('axios')
const bodyParser = require('body-parser')

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

//Route creata da Giuseppe Basile per renderizzare il form aggiungi appuntamento
app.get('/aggiungiAppuntamento', (req, res) => {
    res.render(__dirname + "/views/aggiungiAppuntamento")
}) 

//Route creata da Giuseppe Basile per funzione post per aggiungere appuntamento
app.post('/addAppuntamento',(req, res) => {
   axios.post("http://localhost:3030/appuntamenti" , req.body)
   .then(function(response){
        res.send("Appuntamento Aggiunto")
   })
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})

