const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))

app.get('/', (req, res) => {
    // switcha il commento per cambiare sidebar visualizzata (usato per testare se tutto va)
    let user = 'medico'
    // let user = 'infermiere'
    // let user = 'segretario'
    // res.render(__dirname + "/views/index", {user : user})
    res.render(__dirname + '/views/loginPage')
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
