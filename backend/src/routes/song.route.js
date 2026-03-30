import { Router } from "express";
import {
	getAllSongs,
	getFeaturedSongs,
	getMadeForYouSongs,
	GetSong,
	getSongById,
	getTrendingSongs,
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ✅ Public route — for frontend (HomePage, GetSong, etc.)
router.get("/", GetSong);

// ✅ Admin-only route
router.get("/all", protectRoute, requireAdmin, getAllSongs);

// ✅ Other routes
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/:songId", getSongById);

export default router;
