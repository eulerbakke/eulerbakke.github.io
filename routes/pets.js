const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Pet = require('../models/pet');
const Review = require('../models/review');
const { isLoggedIn, isAuthor, validatePet } = require('../middleware');




router.get('/', catchAsync(async (req, res) => {
    const pets = await Pet.find({});
    res.render('pets/index', { pets })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('pets/new');
})

router.post('/', isLoggedIn, validatePet, catchAsync(async (req, res, next) => {
    // if (!req.body.pet) throw new ExpressError('Os dados do pet são inválidos.', 400);
    const pet = new Pet(req.body.pet);
    pet.author = req.user._id;
    pet.photos = 'https://source.unsplash.com/collection/70293663';
    await pet.save();
    req.flash('success', 'Pet cadastrado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const pet = await Pet.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(pet);
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/show', { pet });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/edit', { pet });
}))

router.put('/:id', isLoggedIn, isAuthor, validatePet, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    req.flash('success', 'Pet atualizado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Pet.findByIdAndDelete(id);
    req.flash('success', 'Pet removido com sucesso!');
    res.redirect('/pets');
}))

module.exports = router;
