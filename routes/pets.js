const express = require('express');
const router = express.Router();
const pets = require('../controllers/pets');
const catchAsync = require('../utils/catchAsync');
const Pet = require('../models/pet');
const Review = require('../models/review');
const { isLoggedIn, isAuthor, validatePet } = require('../middleware');

router.route('/')
    .get(catchAsync(pets.index))
    .post(isLoggedIn, validatePet, catchAsync(pets.createPet));

router.get('/new', isLoggedIn, pets.renderNewForm);


router.route('/:id')
    .get(catchAsync(pets.showPet))
    .put(isLoggedIn, isAuthor, validatePet, catchAsync(pets.updatePet))
    .delete(isLoggedIn, isAuthor, catchAsync(pets.deletePet));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pets.renderEditForm));

module.exports = router;
