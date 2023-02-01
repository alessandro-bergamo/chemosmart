process.env.TZ='UTC'
const express = require('express')
const mongoose = require('mongoose')


//prende le routes
const appuntamentiRoutes = require('./routes/appuntamenti.js')

//cors servirà in futurto quando collegheremo tutto al frontend e per le varie orgin esterne. per chiarimenti vedere info su CORS
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3030

const CONNECTION_DB_URL = 'mongodb+srv://admin:admin@chemosmart.ce52soe.mongodb.net/Appuntamento?retryWrites=true&w=majority'

//midlware per gestire il body della request
app.use(express.json())

//usa cors
app.use(cors())

//usa le routes
app.use('/appuntamenti', appuntamentiRoutes)

app.get('/', (req,res)=>{
    res.send("funziona")
})

//connesione a mongo
/* mongoose.set('strictQuery', false) */    //questo serve per eliminare il warning quando esegui il progetto, però per adesso non lo voglio gestire
mongoose.connect(CONNECTION_DB_URL)
.then(()=>{
    console.log('connessione al db...')
    app.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`));
})
.catch(error => console.error(error))

