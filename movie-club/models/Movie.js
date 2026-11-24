const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    genre: { type: String, required: [true, "Genre is required"], trim: true },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1888, "Release year must be 1888 or later"],
      max: [2100, "Release year is too far in the future"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be between 0 and 10"],
      max: [10, "Rating must be between 0 and 10"],
    },
    director: { type: String, required: [true, "Director is required"], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
