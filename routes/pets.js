const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { petSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Pet = require('../models/pet');
const Review = require('../models/review');


const validatePet = (req, res, next) => {
    const { error } = petSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}

router.get('/', catchAsync(async (req, res) => {
    const pets = await Pet.find({});
    res.render('pets/index', { pets })
}))

router.get('/new', (req, res) => {
    res.render('pets/new');
})

router.post('/', validatePet, catchAsync(async (req, res, next) => {
    // if (!req.body.pet) throw new ExpressError('Os dados do pet são inválidos.', 400);
    const pet = new Pet(req.body.pet);
    pet.photos = 'https://source.unsplash.com/collection/70293663';
    await pet.save();
    req.flash('success', 'Pet cadastrado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const pet = await Pet.findById(req.params.id).populate('reviews');
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/show', { pet });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/edit', { pet });
}))

router.put('/:id', validatePet, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    req.flash('success', 'Pet atualizado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Pet.findByIdAndDelete(id);
    req.flash('success', 'Pet removido com sucesso!');
    res.redirect('/pets');
}))

module.exports = router;
