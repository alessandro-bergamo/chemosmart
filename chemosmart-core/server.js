const express = require('express')
const path = require('path')
const app = express()
const port = 3001

app.set('view engine', 'ejs')
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))

app.get('/', (req, res) => {
    res.render(__dirname + "/views/index")
})

app.get('/medico', (req, res) => {
    res.render(__dirname + "/views/medicoHomePage")
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
