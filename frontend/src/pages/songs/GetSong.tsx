import { useEffect, useState } from "react";
import axios from "axios";
import { Song } from "@/types";
import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "../home/components/SectionGridSkeleton";
import PlayButton from "../home/components/PlayButton";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";

const GetSong = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	navigate("/home");

	const { playAlbum } = usePlayerStore(); // player store to play song

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

	// Fetch all songs (used on initial load)
	const fetchAllSongs = async () => {
		try {
			setIsLoading(true);
			setError(null);
			console.log(import.meta.env.VITE_API_URL);
            const res = await axios.get(`${API_URL}/songs`);
			const fetchedSongs: Song[] = res.data?.songs || res.data;
			setSongs(fetchedSongs);
		} catch (error) {
			console.error("❌ Error fetching songs:", error);
			setError("Failed to load songs. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch songs without affecting loading state (for button)
	const fetchSongsSilently = async () => {
		try {
			const res = await axios.get(`${API_URL}/songs`);
			const fetchedSongs: Song[] = res.data?.songs || res.data;
			setSongs(fetchedSongs);
		} catch (error) {
			console.error("❌ Error fetching songs:", error);
		}
	};

	useEffect(() => {
		fetchAllSongs();
	}, []);

	if (isLoading && songs.length === 0) return <SectionGridSkeleton />;
	if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

	return (
		<div className="h-full px-6 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl sm:text-3xl font-bold">All Songs</h2>
				<Button
					variant="link"
					className="text-sm text-zinc-400 hover:text-white"
					onClick={fetchSongsSilently} // ✅ silent fetch, no loading
				>
					Refresh
				</Button>
			</div>

			{/* Scrollable Songs Grid */}
			<ScrollArea className="h-[calc(100vh-150px)] w-full rounded-lg">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
					{songs.length === 0 ? (
						<p className="text-zinc-400 text-center mt-6">No songs found.</p>
					) : (
						songs.map((song) => (
							<div
								key={song._id}
								className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
								onClick={() => playAlbum([song as any], 0)} // ✅ play immediately
							>
								<div className="relative mb-4">
									<div className="aspect-square rounded-md shadow-lg overflow-hidden">
										<img
											src={song.imageUrl}
											alt={song.title}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<PlayButton song={song} />
								</div>
								<h3 className="font-medium text-white mb-2 truncate">{song.title}</h3>
								<p className="text-sm text-zinc-400 truncate">{song.artist}</p>
							</div>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default GetSong;
