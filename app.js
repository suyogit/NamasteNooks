const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;

// Connect to MongoDB
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

MONGO_URI = "mongodb://127.0.0.1:27017/NamasteNooks";

async function main() {
  await mongoose.connect(MONGO_URI);
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
