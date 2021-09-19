const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Pet = require('./models/pet');
const morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/pet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/pets', async (req, res) => {
    const pets = await Pet.find({});
    res.render('pets/index', { pets })
})

app.get('/pets/new', (req, res) => {
    res.render('pets/new');
})

app.post('/pets', async (req, res) => {
    const pet = new Pet(req.body.pet);
    console.log(req.body)
    console.log(pet)
    pet.photos = 'https://source.unsplash.com/collection/70293663';
    await pet.save();
    res.redirect(`/pets/${pet._id}`);
})

app.get('/pets/:id', async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    res.render('pets/show', { pet });
})

app.get('/pets/:id/edit', async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    res.render('pets/edit', { pet });
})

app.put('/pets/:id', async (req, res) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    res.redirect(`/pets/${pet._id}`);
})

app.delete('/pets/:id', async (req, res) => {
    const { id } = req.params;
    await Pet.findByIdAndDelete(id);
    res.redirect('/pets');
})

app.use((req, res) => {
    res.status(404).send('Página não encontrada');
})

app.listen(3000, () => {
    console.log("Serving on PORT 3000.")
})

