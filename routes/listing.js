const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/Listing");
const { isLoggedIn } = require("../middleware");
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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, price, location, country } = req.body.listing;
    //console.log(req.user);
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    if (!listing) {
      req.flash("error", "Cannot create listing");
      return res.redirect("/listings/new");
    }
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
  })
);

//show route
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
      .populate("reviews")
      .populate("owner");

    if (!listing) {
      req.flash("error", "Cannot find listing");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Cannot find listing");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    // console.log(listing.owner._id);
    // console.log(res.locals.currUser._id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You do not have permission to edit this listing");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body.listing }
      //diffent between req.body.listing and {...req.body.listing} is that req.body.listing is an object and {...req.body.listing} is a copy of that object
      // and if we change the copy the original will not be changed
    );
    req.flash("success", "Successfully updated a listing");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully Deleted a listing");

    res.redirect("/listings");
  })
);

module.exports = router;
