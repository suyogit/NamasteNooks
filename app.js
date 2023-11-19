const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/Listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Yak and Yeti",
//     description: "A beautiful place to stay",
//     price: 1500,
//     location: "Babarmahal, Kathmandu",
//     country: "Nepal",
//   });
//   await sampleListing.save();
//   res.send(sampleListing);
// });

// index route
app.get("/listings", async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
});

//new form route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // let { title, description, price, location, country } = req.body.listing;
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  })
);



//show route
app.get("/listings/:id", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  res.render("listings/show.ejs", { listing });
});



//edit form route
app.get("/listings/:id/edit", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  res.render("listings/edit.ejs", { listing });
});


app.put("/listings/:id", async (req, res) => {
  let listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing }
    //diffent between req.body.listing and {...req.body.listing} is that req.body.listing is an object and {...req.body.listing} is a copy of that object
    // and if we change the copy the original will not be changed
  );
  res.redirect(`/listings/${listing._id}`);
});



//delete route
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

// Error Handling
app.use((err, req, res, next) => {
  res.send("Something went wrong");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
