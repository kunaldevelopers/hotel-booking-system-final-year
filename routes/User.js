const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/User.js");

router.route("/signup")
    // Render Signup Page
    .get(wrapAsync(userController.signupRender))
    // Signup Page
    .post(wrapAsync(userController.signup));

router.route("/login")
    // Login Page
    .get(wrapAsync(userController.loginPage))
    // Login Post
    .post(savedRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.loginPost));

// Log Out User
router.get("/logout", userController.logout);

module.exports = router;

// Render Signup
// router.get("/signup", wrapAsync(userController.signupRender));

// Signup Page
// router.post("/signup", wrapAsync(userController.signup));

 // Login Page
//  router.get("/login", wrapAsync(userController.loginPage));

// Login Post
// router.post("/login",savedRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.loginPost));



