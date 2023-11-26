const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const initData = require("./data.js");

// Connect to MongoDB
MONGO_URL = "mongodb://127.0.0.1:27017/NamasteNooks";

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "655ec624b3063b76c4207b4e",
  }));


  await Listing.insertMany(initData.data);
  console.log("Database initialized");
};
initDB();
