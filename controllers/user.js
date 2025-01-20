const { user } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

module.exports = {

    getRegisterPage: (req, res, next) => {
        res.render('register', { title: 'Register' });
    },

    getLoginPage: (req, res, next) => {
        if (req.isAuthenticated())
            res.render('profile', { username: req.user.username });
        else
            res.render('login', { title: 'Login' });
    },

    getProfilePage: (req, res, next) => {
        if (req.isAuthenticated())
            res.render('profile', { username: req.user.username });
        else
            res.redirect('/user/login');
    },

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
        req.flash('success_msg', '註冊成功!');
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

    googleLogin: passport.authenticate('google', {
        scope: ['email', 'profile'],
        prompt: 'select_account', //要求 Google 顯示帳戶選擇器，讓用戶選擇哪個帳戶來登入
    }),

    googleCallBack: passport.authenticate('google', {
        session: true, //是否在使用者成功登入後建立一個會話
        successRedirect: '/user/profile',
        failureRedirect: '/user/login'
    })

}