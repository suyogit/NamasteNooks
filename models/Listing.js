const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [long,lat]
      required: true,
    },
  },
});

ListingSchema.post("findOneAndDelete", async function (listing) {
  //doc is the document that was deleted wich is listing
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }, // if _id is the part of list then it will be deleted . here _id is the id of review
    });
  }
});



const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
