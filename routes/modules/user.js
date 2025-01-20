const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userCtr } = require("../../controllers");


router.get("/register", userCtr.getRegisterPage);
router.get("/login", userCtr.getLoginPage);
router.get("/profile", userCtr.getProfilePage);

router.get('/googleLogin', userCtr.googleLogin);
router.get('/google/callback', userCtr.googleCallBack);

router.post("/register", userCtr.register);
router.post("/login", userCtr.login);
router.post("/logout", userCtr.logout);

module.exports = router;