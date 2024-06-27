const googleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { user } = require("../models");
const bcrypt = require('bcrypt');

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/google/callback",

}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
        const { email } = profile._json;
        const password = Math.random().toString(36).slice(-8)
        const [userData, created] = await user.findOrCreate({
            where: { username: email },
            defaults: {
                password: bcrypt.hashSync(password, 10),
            }
        });

        if (!userData) throw new Error("查無此用戶");

        done(null, userData);

    } catch (err) {
        done(err, false);
    }

}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {

        const userData = await user.findOne({ where: { id } })
        if (!userData) throw new Error("google deserializeUser err");

        done(null, userData);

    } catch (err) {
        done(err, false);
    }
})