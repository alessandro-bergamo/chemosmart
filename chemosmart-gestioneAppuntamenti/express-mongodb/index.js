const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb+srv://admin:michele@chemosmart.ce52soe.mongodb.net/?retryWrites=true&w=majority";

const Appuntamento = require("./modules/Appuntamento");

const insertUser = async(obj) =>{
    const user = new Appuntamento(obj);
    await user.save();
}

mongoose
    .connect(uri)
    .then(() => {
        const app = express();
        app.get("/", async (req, res) => {
           res.send(insertUser({
                data: new Date(),
                ora: "15:11",
                paziente: "1"
            }))
        });
        app.listen(8000, () => {
            console.log("Server iniziato sulla porta");
        });
    })
    .catch(() => {
        console.log("Database connection failed!");
    });

