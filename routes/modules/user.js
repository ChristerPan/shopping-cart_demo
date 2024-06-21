const express = require("express");
const router = express.Router();
//const passport = require("passport");
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





router.post("/register", userCtr.register);
router.post("/login", userCtr.login);
router.post("/logout", userCtr.logout);

router.post("/deleteSession", (req, res, next) => {
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
})

module.exports = router;