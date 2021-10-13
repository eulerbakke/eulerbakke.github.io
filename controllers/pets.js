const Pet = require('../models/pet');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const pets = await Pet.find({});
    res.render('pets/index', { pets })
}

module.exports.renderNewForm = (req, res) => {
    res.render('pets/new');
}

module.exports.createPet = async (req, res, next) => {
    const pet = new Pet(req.body.pet);
    pet.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pet.author = req.user._id;
    // pet.photos = 'https://source.unsplash.com/collection/70293663';
    await pet.save();
    console.log(pet)
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
    const photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pet.photos.push(...photos);
    await pet.save();
    if (req.body.deletePhotos) {
        for (let filename of req.body.deletePhotos) {
            await cloudinary.uploader.destroy(filename);
        }
        await pet.updateOne({ $pull: { photos: { filename: { $in: req.body.deletePhotos } } } });
    }
    req.flash('success', 'Pet atualizado com sucesso!');
    res.redirect(`/pets/${pet._id}`);
}

module.exports.deletePet = async (req, res) => {
    const { id } = req.params;
    await Pet.findByIdAndDelete(id);
    req.flash('success', 'Pet removido com sucesso!');
    res.redirect('/pets');
}