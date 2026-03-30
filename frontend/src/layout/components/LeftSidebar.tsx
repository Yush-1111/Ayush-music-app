import { SignedIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { HomeIcon, Library, Music, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useEffect } from "react";

const LeftSidebar = () => {
  const { albums, songs, fetchAlbums, fetchSongs, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation */}
      <div className="rounded-lg bg-zinc-900 p-4 space-y-2">
        <Link
          to="/"
          className={cn(buttonVariants({ variant: "ghost", className: "w-full justify-start text-white hover:bg-zinc-800" }))}
        >
          <HomeIcon className="mr-2 size-5" />
          <span className="hidden md:inline">Home</span>
        </Link>

        <Link
          to="/getsong"
          className={cn(buttonVariants({ variant: "ghost", className: "w-full justify-start text-white hover:bg-zinc-800" }))}
        >
          <Music className="mr-2 size-5" />
          <span className="hidden md:inline">Songs</span>
        </Link>
        <Link
          to="/createPlaylist"
          className={cn(buttonVariants({ variant: "ghost", className: "w-full justify-start text-white hover:bg-zinc-800" }))}
        >
          <Music className="mr-2 size-5" />
          <span className="hidden md:inline">Create Playlist</span>
        </Link>

        <SignedIn>
          <Link
            to="/chat"
            className={cn(buttonVariants({ variant: "ghost", className: "w-full justify-start text-white hover:bg-zinc-800" }))}
          >
            <MessageCircle className="mr-2 size-5" />
            <span className="hidden md:inline">Messages</span>
          </Link>
        </SignedIn>
      </div>

      {/* Library */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4 px-2 text-white">
          <Library className="size-5 mr-2" />
          <span className="hidden md:inline">Library</span>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] space-y-4">
          {/* Albums */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2 px-2">Albums</h3>
            <div className="space-y-2">
              {isLoading ? (
                <PlaylistSkeleton />
              ) : albums.length === 0 ? (
                <p className="text-sm text-zinc-500 px-2">No albums found</p>
              ) : (
                albums.map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img src={album.imageUrl} alt={album.title} className="size-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate text-white">{album.title}</p>
                      <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Songs */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2 px-2">Songs</h3>
            <div className="space-y-2">
              {isLoading ? (
                <PlaylistSkeleton />
              ) : songs.length === 0 ? (
                <p className="text-sm text-zinc-500 px-2">No songs found</p>
              ) : (
                songs.map((song) => (
                  <Link
                    to={`/songs/${song._id}`}
                    key={song._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img src={song.imageUrl} alt={song.title} className="size-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate text-white">{song.title}</p>
                      <p className="text-sm text-zinc-400 truncate">Song • {song.artist}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
