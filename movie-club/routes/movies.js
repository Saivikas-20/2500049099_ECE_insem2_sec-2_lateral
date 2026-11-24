const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid value provided" });
  }
  console.error(err);
  return res.status(500).json({ error: "Server error" });
};

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid movie id" });
  }
  next();
};

// CREATE - add a new movie
router.post("/", async (req, res) => {
  try {
    const { title, genre, releaseYear, rating, director } = req.body;
    const movie = await Movie.create({ title, genre, releaseYear, rating, director });
    res.status(201).json(movie);
  } catch (err) {
    handleError(res, err);
  }
});

// READ - list all movies, optionally search by title or genre (?q=...)
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    let filter = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter = { $or: [{ title: rx }, { genre: rx }] };
    }
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    handleError(res, err);
  }
});

// READ - single movie
router.get("/:id", validId, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE - edit movie details
router.put("/:id", validId, async (req, res) => {
  try {
    const { title, genre, releaseYear, rating, director } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, releaseYear, rating, director },
      { new: true, runValidators: true }
    );
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE - remove a movie
router.delete("/:id", validId, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted", id: movie._id });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
