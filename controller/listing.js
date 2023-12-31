const Listing = require("../models/Listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//ref https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode-1
module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Cannot find listing");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

 

  module.exports.createListing = async (req, res, next) => {
    // let { title, description, price, location, country } = req.body.listing;
    //console.log(req.user);
    try {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();

      if (!response.body.features || response.body.features.length === 0) {
        // No matching location found
        req.flash("error", "Please enter a valid and known location.");
        return res.redirect("/listings/new");
      }

      let url = req.file.path;
      let filename = req.file.filename;
      let listing = new Listing(req.body.listing);

      listing.owner = req.user._id;
      listing.image = { url, filename };
      listing.geometry = response.body.features[0].geometry;
      await listing.save();

      req.flash("success", "Successfully made a new listing");
      res.redirect("/listings");
    } catch (error) {
      // Handle other errors
      console.error(error);
      req.flash("error", "An error occurred while processing the request.");
      res.redirect("/listings/new");
    }
  };
  module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Cannot find listing");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_200,h_200"
    );
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
    let listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body.listing }
      //diffent between req.body.listing and {...req.body.listing} is that req.body.listing is an object and {...req.body.listing} is a copy of that object
      // and if we change the copy the original will not be changed
    );

    if (req.body.listing.location !== listing.location) {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
      listing.geometry = response.body.features[0].geometry;
      await listing.save();
    }

    if (typeof req.file !== "undefined" && req.file !== null) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Successfully updated a listing");
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully Deleted a listing");

  res.redirect("/listings");
};
