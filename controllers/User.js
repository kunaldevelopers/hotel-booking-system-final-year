const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");

// Render Signup Page
module.exports.signupRender = (req, res) => {
    res.render("users/signup.ejs");
}

// Signup
module.exports.signup = async(req, res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email, username});

        const registedUser = await User.register(newUser, password);
        console.log(registedUser);
        // For Implant Auto Login After Sign Up New User
        req.login(registedUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome To Wonderlust!!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message,"⚠️⚠️");
        res.redirect("/signup");
        console.log(error.message);
    }
}

// Login Page 
module.exports.loginPage = (req, res)=>{
    res.render("users/login.ejs")
}

// Login Post
module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome To Wonderlust, You Are Logged In!!🫡🫡");
    let RedirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(RedirectUrl);
}

// Logout User
module.exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logged You Out!!");
        res.redirect("/listings");
    });
}
// Logout User
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle the error and pass it to the next middleware
        }
        req.flash("success", "Logged You Out!!");
        res.redirect("/listings"); // Redirect after successful logout
    });
};
