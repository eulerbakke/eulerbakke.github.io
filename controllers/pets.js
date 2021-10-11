const Pet = require('../models/pet');

module.exports.index = async (req, res) => {
    const pets = await Pet.find({});
    res.render('pets/index', { pets })
}

module.exports.renderNewForm = (req, res) => {
    res.render('pets/new');
}

module.exports.createPet = async (req, res, next) => {
    // if (!req.body.pet) throw new ExpressError('Os dados do pet são inválidos.', 400);
    const pet = new Pet(req.body.pet);
    pet.author = req.user._id;
    pet.photos = 'https://source.unsplash.com/collection/70293663';
    await pet.save();
    req.flash('success', 'Pet cadastrado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}

module.exports.showPet = async (req, res) => {
    const pet = await Pet.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/show', { pet });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
        req.flash('error', 'Pet não encontrado!');
        return res.redirect('/pets');
    }
    res.render('pets/edit', { pet });
}

module.exports.updatePet = async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    req.flash('success', 'Pet atualizado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}

module.exports.deletePet = async (req, res) => {
    const { id } = req.params;
    await Pet.findByIdAndDelete(id);
    req.flash('success', 'Pet removido com sucesso!');
    res.redirect('/pets');
}