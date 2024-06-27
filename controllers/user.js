const { user } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

module.exports = {
    register: async (req, res, next) => {

        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash("warning_msg", "密碼不一致");
            req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.status(400).redirect("/user/register");
            });

            return;
        }

        const userData = await user.findOne({ where: { username } });

        if (userData) {
            req.flash("warning_msg", "這個Email被註冊過了!");
            req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.status(400).redirect("/user/register");
            });
            return;
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        await user.create({ username, password: hashedPassword });
        req.flash('success_msg', 'Register Success!');
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.status(400).redirect("back");
        });
        return;
    },

    login: (req, res, next) => {

        passport.authenticate("local", (err, user, info) => {

            console.log("passport.authenticate err " + err);

            if (user) {
                req.login(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        res.redirect("/user/profile");
                    }
                });

            } else {
                req.flash("warning_msg", "帳號或密碼錯誤");
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                    }
                    res.redirect("/user/login");
                });
            }


        })(req, res, next)

    },

    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return res.status(400).send(`Error: ${err}`)
            }
            else {
                req.session.destroy((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect("/user/login");
                });

            }
        });
    },


}