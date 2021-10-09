const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Pet = require('./models/pet');
const morgan = require('morgan');
const { error } = require('console');
const { errorMonitor } = require('events');
const Review = require('./models/review');

const pets = require('./routes/pets');
const reviews = require('./routes/reviews');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/pets', pets);
app.use('/pets/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Página não encontrada.', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Algo deu errado' } = err;
    if (!err.message) err.message = 'Algo deu errado.';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on PORT 3000.")
})

