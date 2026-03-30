import { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/react";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const { isSignedIn } = useUser(); // ✅ new hook
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) handleSearch(query);
      else {
        setSongs([]);
        setAlbums([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = async (searchTerm: string) => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${API_URL}/search?query=${searchTerm}`);
      setSongs(res.data.songs || []);
      setAlbums(res.data.albums || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search request failed: ", err);
    }
  };

  const handleSongSelect = (songId: string) => {
    setQuery("");
    setShowResults(false);
    navigate(`/songs/${songId}`);
  };

  const handleAlbumSelect = (albumId: string) => {
    setQuery("");
    setShowResults(false);
    navigate(`/albums/${albumId}`);
  };

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md border-b border-zinc-800 z-30">
      
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" className="w-8 h-8" alt="Spotify logo" />
        <span className="font-semibold text-lg text-white">Ayush.Dev</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 mx-4" ref={searchRef}>
        <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-full px-3">
          <Search className="text-zinc-400 w-4 h-4 mr-2" />
          <Input
            type="text"
            placeholder="Search songs, albums, or artists..."
            className="bg-transparent border-none text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:outline-none w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
          />
        </div>

        {showResults && (songs.length > 0 || albums.length > 0) && (
          <div className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg max-h-80 overflow-y-auto z-40 p-2">
            
            {/* Songs */}
            {songs.length > 0 && (
              <div className="mb-3">
                <h3 className="text-xs uppercase text-zinc-500 mb-1 px-2">Songs</h3>
                {songs.map((song) => (
                  <div
                    key={song._id}
                    onClick={() => handleSongSelect(song._id)}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 cursor-pointer rounded-lg"
                  >
                    <img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
                    <div>
                      <p className="text-white text-sm font-medium truncate">{song.title}</p>
                      <p className="text-zinc-400 text-xs truncate">🎵 {song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <div>
                <h3 className="text-xs uppercase text-zinc-500 mb-1 px-2">Albums</h3>
                {albums.map((album) => (
                  <div
                    key={album._id}
                    onClick={() => handleAlbumSelect(album._id)}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 cursor-pointer rounded-lg"
                  >
                    <img src={album.imageUrl} alt={album.title} className="w-10 h-10 rounded-md object-cover" />
                    <div>
                      <p className="text-white text-sm font-medium truncate">{album.title}</p>
                      <p className="text-zinc-400 text-xs truncate">💿 {album.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin" className={cn(buttonVariants({ variant: "outline" }))}>
            <LayoutDashboardIcon className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        {/* ✅ Fixed Auth UI */}
        {!isSignedIn && <SignInOAuthButtons />}
        {isSignedIn && <UserButton />}
      </div>
    </div>
  );
};

export default Topbar;