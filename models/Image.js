const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);
