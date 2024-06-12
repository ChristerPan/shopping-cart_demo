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
    res.render("profile");
});





router.post("/register", (req, res) => {
    const success = false;
    if (success) {
        req.flash("success_msg", "註冊成功");
        res.redirect("/user/register");
    }
    else {
        req.flash("warning_msg", "註冊失敗");
        res.redirect("/user/register");
    }
});
router.post("/login", (req, res) => {
    const success = false;
    if (success) {
        req.flash("success_msg", "登入成功");
        res.redirect("/user/login");
    }
    else {
        req.flash("warning_msg", "登入失敗");
        res.redirect("/user/login");
    }
});
router.post("/logout", (req, res) => {
    const success = false;
    if (success) {
        req.flash("success_msg", "登出成功");
        res.redirect("/user/login");
    }
    else {
        req.flash("warning_msg", "登出失敗");
        res.redirect("/user/login");
    }
});


module.exports = router;