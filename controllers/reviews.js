const Pet = require('../models/pet');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    pet.reviews.push(review);
    await review.save();
    await pet.save();
    req.flash('success', 'Novo comentário adicionado!');
    res.redirect(`/pets/${pet._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Pet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comentário removido com sucesso!')
    res.redirect(`/pets/${id}`);
}
