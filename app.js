const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const listings = require("./routes/listing");
const reviews = require("./routes/review");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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
