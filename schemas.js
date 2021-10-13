const Joi = require('joi');

module.exports.petSchema = Joi.object({
    pet: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        castrated: Joi.boolean(),
        vaccinated: Joi.boolean(),
        readyForAdoption: Joi.boolean(),
        dewormed: Joi.boolean(),
        dateOfBirth: Joi.date()
    }).required(),
    deletePhotos: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        adoptionIntent: Joi.number().required().min(1).max(5)
    }).required()
})