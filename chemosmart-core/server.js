const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))

app.get('/', (req, res) => {
    res.render(__dirname + '/views/loginPage')
})

app.post('/login',(req, res) => {
    // switcha il commento per cambiare sidebar visualizzata (usato per testare se tutto va)
    let user = 'medico'
    // let user = 'infermiere'
    // let user = 'segretario'
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
    res.render(__dirname + "/views/filtri")
}) 

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})

