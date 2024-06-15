const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userCtr } = require("../../controllers");


router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/login", (req, res) => {
    if (req.isAuthenticated)
        res.redirect("/user/profile");
    else
        res.render("login");
});
router.get("/profile", (req, res) => {
    // if (!req.isAuthenticated())
    //     res.redirect("/user/login");
    // else
    //     res.render("profile");
    res.render("profile", { username: req.session.user.username });
});





router.post("/register", userCtr.register);
router.post("/login", userCtr.login);


module.exports = router;