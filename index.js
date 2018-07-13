require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const students = require(`${__dirname}/students.json`)

const app = express();
app.use( session({
    secret: 'Sp00ky seeeecr3t',
    resave: false,
    saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );

passport.use( new Auth0Strategy ({
        domain: process.env.DOMAIN,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/login',
        scope: "openid email profile",
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        done(null, profile)
    }
))

passport.serializeUser(function (user, done) {
    done(null, { clientID: user.id, email: user._json.email, name: user._json.name })
})

passport.deserializeUser(function (obj, done) {
    done(null, obj)
})

app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/students', failureRedirect: '/login', connection: 'github' 
}))

authenticated = (req,res,next) => {
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

app.get('/students', authenticated, (req,res,next) => {
    res.status(200).send(students)
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );