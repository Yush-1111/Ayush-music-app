import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

//  Create playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.auth.userId;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const playlist = await Playlist.create({ title, description, createdBy });
    res.status(201).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

//  Get all playlists by current user
export const getMyPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.auth.userId }).populate("songs");
    res.status(200).json({ success: true, playlists });
  } catch (error) {
    next(error);
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const updated = await Playlist.findById(playlistId).populate("songs");
    res.status(200).json({ success: true, playlist: updated });
  } catch (error) {
    next(error);
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    const updated = await Playlist.findById(playlistId).populate("songs");
    res.status(200).json({ success: true, playlist: updated });
  } catch (error) {
    next(error);
  }
};

//  Delete playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const deleted = await Playlist.findOneAndDelete({
      _id: playlistId,
      createdBy: req.auth.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Playlist not found or unauthorized" });
    res.status(200).json({ success: true, message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};
