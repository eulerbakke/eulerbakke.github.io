const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: String,
    description: String,
    birthDate: Date,
    photos: [String],
    readyForAdoption: {
        type: Boolean,
        required: true,
        default: false
    },
    castrated: {
        type: Boolean,
        required: true,
        default: false
    },
    vaccinated: {
        type: Boolean,
        required: true,
        default: false
    },
    dewormed: {
        type: Boolean,
        required: true,
        default: false
    },
    location: String
});

module.exports = mongoose.model('Pet', PetSchema);