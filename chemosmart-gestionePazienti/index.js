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
            sesso: "M",
            dataNascita: "2000-02-12",
            Eta: 33,
            "indice inquinamento ambientale": 2,
            "indice uso alcolici": 4,
            "grado di allergia": 5,
            "grado di rischio lavorativo": 4,
            "indice dei fattori di rischio familiare": 3,
            "indice di malattie croniche": 2,
            "indice di alimentazione scorretta": 2,
            "indice di obesita": 4,
            "grado di esposizione a fumo attivo": 3,
            "grado di esposizione a fumo passivo": 2,
            "indice di dolori localizzati": 2,
            "indice emottisi": 4,
            "indice astenia": 3,
            "indice di perdita di peso": 4,
            "indice dispnea": 2,
            "indice respiro sibilante": 2,
            "indice disfagia": 3,
            "stato dita di Ippocrate": 1,
            "stato di immunodepressione": 2,
            "indice tosse secca": 3,
            "indice di russamento": 4
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