const mongoose = require('mongoose');
const { petSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review')

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
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

PetSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Pet', PetSchema);