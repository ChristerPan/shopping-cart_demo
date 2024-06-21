const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const brcypt = require("bcrypt");
const { user } = require("../models");

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {

        const userData = await user.findOne({ where: id })
        if (!userData) throw new Error("deserializeUser err");

        done(null, userData);

    } catch (err) {
        done(err, false);
    }
})


passport.use(new Strategy(
    {
        passReqToCallback: true
    },
    async (req, username, password, done) => {

        try {

            const userData = await user.findOne({ where: { username } });
            if (!userData) throw new Error("查無此用戶");

            const isValid = brcypt.compareSync(password, userData.password);
            if (!isValid) throw new Error("密碼錯誤");

            done(null, userData);

        } catch (err) {
            done(err, false);
        }

    }))