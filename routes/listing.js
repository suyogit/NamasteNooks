const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../models/Listing");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  })
);

//new form route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, price, location, country } = req.body.listing;

    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//edit form route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body.listing }
      //diffent between req.body.listing and {...req.body.listing} is that req.body.listing is an object and {...req.body.listing} is a copy of that object
      // and if we change the copy the original will not be changed
    );
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  })
);

module.exports = router;
