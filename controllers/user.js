const { user } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
    register: async (req, res) => {

        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash("warning_msg", "密碼不一致");
            return res.status(400).redirect("/user/register");
        }

        const userData = await user.findOne({ where: { username } });

        if (userData) {
            req.flash("warning_msg", "這個Email被註冊過了!");
            return res.status(400).redirect("/user/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.create({ username, password: hashedPassword });
        req.flash('success_msg', 'Register Success!');
        return res.status(400).redirect("back");
    },

    login: async (req, res) => {

        const { username, password } = req.body;
        if (!user) console.log("AAAAAAAAAAA");
        const userData = await user.findOne({ where: { username } });

        if (!userData) {
            req.flash('warning_msg', '帳號或密碼錯誤');
            return res.status(400).redirect("/user/login");
        }

        const isValid = await bcrypt.compare(password, userData.password);

        if (!isValid) {
            req.flash('warning_msg', '帳號或密碼錯誤');
            return res.status(400).redirect("/user/login");
        }

        req.session.user = userData;
        // req.session.authorized = true;
        res.redirect("/user/profile");
    },
}