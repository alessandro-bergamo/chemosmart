const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render(__dirname + "/views/partials/sidebar")
})

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
})
