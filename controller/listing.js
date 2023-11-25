const Listing = require("../models/Listing");

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
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url, filename };
  await listing.save();
  if (!listing) {
    req.flash("error", "Cannot create listing");
    return res.redirect("/listings/new");
  }
  req.flash("success", "Successfully made a new listing");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Cannot find listing");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing }
    //diffent between req.body.listing and {...req.body.listing} is that req.body.listing is an object and {...req.body.listing} is a copy of that object
    // and if we change the copy the original will not be changed
  );
  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully Deleted a listing");

  res.redirect("/listings");
};
