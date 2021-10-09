const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Pet = require('../models/pet');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    const review = new Review(req.body.review);
    pet.reviews.push(review);
    await review.save();
    await pet.save();
    req.flash('success', 'Novo comentário adicionado!');
    res.redirect(`/pets/${pet._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Pet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comentário removido com sucesso!')
    res.redirect(`/pets/${id}`);
}))

module.exports = router;