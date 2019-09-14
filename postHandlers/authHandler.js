import CONSTANTS from "../public/js/constants";

const cookieParser = require('cookie-parser');
const session = require('express-session');
const Local = require('passport-local').Strategy;

exports.initPassport = function (app, passport) {
    const localStrategy = function (username, password, done) {
        if (username !== 'bobo') {
            return done(null, false, {message: 'invalid username or password'})
        } else if (password === 'haha') {
            return done(null, {username, password})
        } else {
            return done(null, false, {message: 'invalid username or password'})
        }
    };

    app.use(session({secret: 'cats cats cats', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Local(localStrategy));

    // We attach the user id to the cookie for the session
    passport.serializeUser((user, done) => done(null, user.username));

    // "name" below refers to whatever piece of info is serialized in seralizeUser,
    // in this example we're using the username
    passport.deserializeUser((username, done) => {
        const user = username;
        console.log('deserializing:', user);

        if (user !== undefined) {
            done(null, user)
        } else {
            done(null, false, {message: 'user not found; session not restored'})
        }
    });

    //this defines what we send to the user on a successful authentication
    app.post(
        CONSTANTS.LOGIN,
        passport.authenticate('local', {failureRedirect: '/'}),
        function (req, res) {
            console.log('user:', req.user);
            res.json({status: true})
        }
    );

    app.post('/test', function( req, res ) {
        console.log( 'authenticate with cookie?', req.user );
        res.json({ status:'success' })
    });
};