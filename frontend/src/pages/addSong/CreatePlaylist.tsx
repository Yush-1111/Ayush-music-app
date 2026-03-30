import { useEffect, useState } from "react";
import axios from "axios";
import { Song } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import toast from "react-hot-toast";
import PlayButton from "../home/components/PlayButton";


const CreatePlaylist = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  

  // 🔹 Fetch all songs
  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${API_URL}/songs`);
      setSongs(res.data?.songs || res.data);
    } catch {
      toast.error("Failed to load songs");
    }
  };

  // 🔹 Fetch user playlists
  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${API_URL}/playlists`, { withCredentials: true });
      setPlaylists(res.data.playlists || res.data);
    } catch {
      toast.error("Failed to load playlists");
    }
  };

  // 🔹 Create playlist
  const handleCreatePlaylist = async () => {
    if (!title.trim()) return toast.error("Please enter a playlist title");
    try {
      setLoading(true);
      await axios.post(`${API_URL}/playlists`, { title }, { withCredentials: true });
      toast.success("Playlist created!");
      setTitle("");
      fetchPlaylists();
    } catch {
      toast.error("Error creating playlist");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add song
  const handleAddSong = async (playlistId: string, songId: string) => {
    try {
      await axios.post(`${API_URL}/playlists/${playlistId}/songs`, { songId }, { withCredentials: true });
      toast.success("Song added!");
      fetchPlaylists();
    } catch {
      toast.error("Error adding song");
    }
  };

  // 🔹 Remove song
  const handleRemoveSong = async (playlistId: string, songId: string) => {
    try {
      await axios.delete(`${API_URL}/playlists/${playlistId}/songs/${songId}`, { withCredentials: true });
      toast.success("Song removed!");
      fetchPlaylists();
    } catch {
      toast.error("Error removing song");
    }
  };

  // 🔹 Delete playlist
  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await axios.delete(`${API_URL}/playlists/${playlistId}`, { withCredentials: true });
      toast.success("Playlist deleted!");
      fetchPlaylists();
    } catch {
      toast.error("Error deleting playlist");
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  return (
    <div className="h-full px-6 py-8 space-y-8">
      {/* Playlist Creator */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="New playlist name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-800 text-white"
        />
        <Button onClick={handleCreatePlaylist} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>

      {/* List of user's playlists */}
      <div className="space-y-8">
        {playlists.length === 0 ? (
          <p className="text-zinc-400">No playlists yet. Create one above!</p>
        ) : (
          playlists.map((pl) => (
            <div key={pl._id} className="bg-zinc-900 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-white">{pl.title}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePlaylist(pl._id)}
                >
                  Delete Playlist
                </Button>
              </div>

              <ScrollArea className="h-[150px] w-full rounded-lg bg-zinc-800/40 p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pl.songs?.length > 0 ? (
                    pl.songs.map((song: Song) => (
                      <div key={song._id} className="relative group">
                        <img
                          src={song.imageUrl}
                          className="rounded-md w-full h-full object-cover"
                        />
                        {/* ✅ Play Button overlay */}
                        <PlayButton song={song} />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveSong(pl._id, song._id)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-400 col-span-full text-center">
                      No songs yet.
                    </p>
                  )}
                </div>
              </ScrollArea>

              {/* Song list for adding */}
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-white mb-2">Add Songs</h4>
                <ScrollArea className="h-[180px] bg-zinc-800/30 rounded-lg p-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {songs.map((song) => (
                      <div
                        key={song._id}
                        className="bg-zinc-700/40 hover:bg-zinc-600/40 rounded-md p-2 cursor-pointer relative group"
                        onClick={() => handleAddSong(pl._id, song._id)}
                      >
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <p className="text-sm text-white truncate mt-1">
                          {song.title}
                        </p>
                        {/* ✅ Optional: PlayButton in add list */}
                        <PlayButton song={song} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreatePlaylist;
