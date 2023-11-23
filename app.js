const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sesstionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
};

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

// Connect to MongoDB
MONGO_URL = "mongodb://127.0.0.1:27017/NamasteNooks";
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(session(sesstionOptions));
app.use(flash());

// Passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to unstore user in session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//demo user
// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "suyog@gmail.com", username: "suyog" });
//   const newUser = await User.register(user, "suyog"); //suyog is password
//   res.send(newUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// Error Handling

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs", { message });
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
