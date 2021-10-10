module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'Você precisa entrar na sua conta primeiro.');
        return res.redirect('/login');
    }
    next();
}