const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/Listing");

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




app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
