import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    createdBy: { type: String, required: true }, // Clerk user ID
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
