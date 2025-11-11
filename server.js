import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/imageAI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ImageSchema = new mongoose.Schema({
  filename: String,
  description: String,
  date: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", ImageSchema);

// File upload setup
const upload = multer({ dest: "uploads/" });

// OpenAI setup
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint: Upload & Analyze
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // vision model
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const description = response.choices[0].message.content;

    const newImage = new Image({
      filename: req.file.originalname,
      description,
    });
    await newImage.save();

    res.json({ description });
    fs.unlinkSync(filePath); // delete temp file
  } catch (error) {
    console.error(error);
    res.status(500).send("Error analyzing image");
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
