import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getMyPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.post("/", protectRoute, createPlaylist);
router.get("/", protectRoute, getMyPlaylists);
router.post("/:playlistId/songs", protectRoute, addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", protectRoute, removeSongFromPlaylist);
router.delete("/:playlistId", protectRoute, deletePlaylist);

export default router;
