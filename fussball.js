const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Player = new Schema({
    playerid: String,
    vorname: String,
    nachname: String,
    profilbild: String,
    alter: Number
});

module.exports = mongoose.model("Player",Player)




