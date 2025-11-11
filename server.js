const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Image = require("./models/Image");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/imageAI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.post("/api/images", async (req, res) => {
  const { name, imageUrl } = req.body;
  const image = new Image({ name, imageUrl });
  await image.save();
  res.json({ message: "Saved successfully!" });
});

app.get("/api/images", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
