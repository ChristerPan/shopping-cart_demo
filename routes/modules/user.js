const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userCtr } = require("../../controllers");


router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/user/profile");
    }
    else {
        res.render("login");
    }
});
router.get("/profile", (req, res) => {
    if (!req.isAuthenticated())
        res.redirect("/user/login");
    else
        res.render("profile", { username: req.user.username });
});

router.get('/googleLogin', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account',
}));
router.get('/google/callback', passport.authenticate('google', {
    session: true,
    successRedirect: '/user/profile',
    failureRedirect: '/user/login'
}))




router.post("/register", userCtr.register);
router.post("/login", userCtr.login);
router.post("/logout", userCtr.logout);

module.exports = router;