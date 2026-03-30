import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

// 🔹 Utility to format seconds into mm:ss
export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 🔹 Song type
interface Song {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	releaseYear?: string;
	createdAt?: string;
}

const SongPage = () => {
	const { songId } = useParams<{ songId: string }>();
	const [song, setSong] = useState<Song | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

	// 🔹 Fetch song by ID
	const fetchSongById = async (id: string) => {
		if (!id) return;
		try {
			setIsLoading(true);
			const res = await axios.get(`${API_URL}/songs/${id}`);
			const fetchedSong: Song = res.data?.song;
			if (fetchedSong) setSong(fetchedSong);
		} catch (err) {
			console.error("Error fetching song:", err);
			setSong(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (songId) fetchSongById(songId);
	}, [songId]);

	if (isLoading || !song) return <div className="text-center mt-10 text-white">Loading...</div>;

	// 🔹 Play/Pause button logic
	const handlePlaySong = () => {
		if (!song) return;
		if (currentSong?._id === song._id && isPlaying) togglePlay();
		else playAlbum([song as any], 0);
	};

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				<div className="relative min-h-full">
					{/* Background Gradient */}
					<div className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none" />

					{/* Content */}
					<div className="relative z-10">
						{/* Song Header */}
						<div className="flex flex-col md:flex-row p-6 gap-6 pb-8">
							<img
								src={song.imageUrl}
								alt={song.title}
								className="w-[240px] h-[240px] shadow-xl rounded-md object-cover"
							/>
							<div className="flex flex-col justify-end">
								<p className="text-sm font-medium text-zinc-400">Song</p>
								<h1 className="text-5xl md:text-7xl font-bold my-4 text-white">{song.title}</h1>
								<div className="flex items-center gap-2 text-sm text-zinc-100">
									<span className="font-medium text-white">{song.artist}</span>
									<span>• {song.releaseYear || "Unknown Year"}</span>
								</div>
							</div>
						</div>

						{/* Play Button */}
						<div className="px-6 pb-4 flex items-center gap-6">
							<Button
								onClick={handlePlaySong}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition-transform hover:scale-105"
							>
								{isPlaying && currentSong?._id === song._id ? (
									<Pause className="h-7 w-7 text-black" />
								) : (
									<Play className="h-7 w-7 text-black" />
								)}
							</Button>
						</div>

						{/* Song Info Table */}
						<div className="bg-black/20 backdrop-blur-sm">
							{/* Table Header */}
							<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
								<div>#</div>
								<div>Title</div>
								<div>Release Date</div>
								<div>
									<Clock className="h-4 w-4" />
								</div>
							</div>

							{/* Single Song Row */}
							<div className="px-6 py-4">
								<div
									className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
									onClick={handlePlaySong}
								>
									<div className="flex items-center justify-center">
										{currentSong?._id === song._id && isPlaying ? (
											<div className="text-green-500">♫</div>
										) : (
											<Play className="h-4 w-4 group-hover:block hidden" />
										)}
									</div>

									<div className="flex items-center gap-3">
										<img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
										<div>
											<div className="font-medium text-white truncate">{song.title}</div>
											<div className="text-zinc-400 text-sm truncate">{song.artist}</div>
										</div>
									</div>

									<div className="flex items-center">
										{song.createdAt ? song.createdAt.split("T")[0] : "Unknown"}
									</div>
									<div className="flex items-center">{formatDuration(song.duration)}</div>
								</div>
							</div>
						</div>

						{/* Optional Audio Player (native) */}
						{/* <div className="px-6 py-6">
							<audio controls src={song.audioUrl} className="w-full rounded-md" />
						</div> */}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default SongPage;
