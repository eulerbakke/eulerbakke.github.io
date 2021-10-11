const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Pet = require('../models/pet');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    pet.reviews.push(review);
    await review.save();
    await pet.save();
    req.flash('success', 'Novo comentário adicionado!');
    res.redirect(`/pets/${pet._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Pet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comentário removido com sucesso!')
    res.redirect(`/pets/${id}`);
}))

module.exports = router;