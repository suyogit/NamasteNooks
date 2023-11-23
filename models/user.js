const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose); // adds username and password to schema

module.exports = mongoose.model("User", userSchema);
