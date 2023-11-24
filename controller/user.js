const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back " + req.user.username + " !");
  // console.log(redirectUrl);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Cannot logout");
      return res.redirect("/listings");
    }
    req.flash("success", "Successfully logged out");
    res.redirect("/listings");
  });
};
