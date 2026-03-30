import express from "express";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

const router = express.Router();

// GET /api/search?query=someText
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Case-insensitive search on song title / artist
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    const albums = await Album.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json({ songs, albums });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
