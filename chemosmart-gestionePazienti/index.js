const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb+srv://claudio:claudio@chemosmart.ce52soe.mongodb.net/Paziente?retryWrites=true&w=majority";

const Pazienti = require("./Pazienti");

const insertUser = async(obj) =>{
    const user = new Pazienti(obj);
    await user.save();
}

mongoose
    .connect(uri)
    .then(() => {
        const app = express();
        app.get("/", async (req, res) => {
           res.send(insertUser({
            nome: "Marco",
            cf: "De Palma",
            telefono: "10",
            email: "c.depalma5@studenti.unisa.it",
            sesso: "3452423623",
            dataNascita: "2000-02-12"
            }))
        });
        app.get("/getPazienti", async (req, res) => {
            // res.send(await Pazienti.find({
            //     nome: "Claudio",
            // }));
            Pazienti.find({})
            .then((value) => {
                res.send(value);
            })
            .catch(() => {
                res.sendStatus(500);
            })
        });
        app.listen(3030, () => {
            console.log("Server iniziato sulla porta");
        });
    })
    .catch((err) => {
        console.log("Error"+err); 
    });