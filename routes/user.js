const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");

//signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

//login

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

//logout
router.get("/logout", userController.logout);


  
   
module.exports = router;
