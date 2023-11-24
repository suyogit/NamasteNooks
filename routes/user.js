const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

//signup
router.get("/signup", (req, res) => {
  res.render("users/signup");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const user = new User({
        email: req.body.email,
        username: req.body.username,
      });

      // Check if password and confirm password match
      if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Passwords do not match");
        return res.redirect("/signup");
      }

      // Register user with passport
      const registeredUser = await User.register(user, req.body.password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash(
          "success",
          "Welcome to NamasteNooks! You have successfully registered."
        );
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//login

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back " + req.user.username + " !");
    const redirectUrl = req.session.returnTo || "/listings";
    // console.log(redirectUrl);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Cannot logout");
      return res.redirect("/listings");
    }
    req.flash("success", "Successfully logged out");
    res.redirect("/listings");
  });
});


  
   
module.exports = router;
