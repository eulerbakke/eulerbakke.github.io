const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: String,
    birthDate: Date,
    readyForAdoption: Boolean,
    castrated: Boolean,
    vaccinated: Boolean,
    dewordmed: Boolean,
    location: String
})

module.exports = mongoose.model('Pet', PetSchema);