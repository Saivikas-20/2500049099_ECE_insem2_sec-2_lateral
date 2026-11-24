require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const movieRoutes = require("./routes/movies");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/movieclub";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/movies", movieRoutes);

// Fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ error: "Route not found" }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
