import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

interface NewAlbum {
	title: string;
	artist: string;
	releaseYear: number;
}

const AddAlbumDialog = () => {
	const { getToken } = useAuth(); // Clerk token
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newAlbum, setNewAlbum] = useState<NewAlbum>({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		if (!imageFile) {
			toast.error("Please upload album artwork");
			return;
		}

		setIsLoading(true);

		try {
			const token = await getToken(); // Get Clerk JWT

			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageFile);

			await axiosInstance.post("/admin/albums", formData, {
				headers: {
					Authorization: `Bearer ${token}`, // send token
					"Content-Type": "multipart/form-data",
				},
			});

			setNewAlbum({ title: "", artist: "", releaseYear: new Date().getFullYear() });
			setImageFile(null);
			setAlbumDialogOpen(false);

			toast.success("Album created successfully!");
		} catch (error: any) {
			console.error("Error creating album:", error);
			toast.error("Failed to create album: " + (error.response?.data?.message || error.message));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-violet-500 hover:bg-violet-600 text-white">
					<Plus className="mr-2 h-4 w-4" />
					Add Album
				</Button>
			</DialogTrigger>

			<DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>Add New Album</DialogTitle>
					<DialogDescription>Add a new album to your collection</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						hidden
						onChange={(e) => setImageFile(e.target.files![0])}
					/>
					<div
						className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="text-center">
							{imageFile ? (
								<div className="text-sm text-violet-400">{imageFile.name}</div>
							) : (
								<>
									<div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
										<Upload className="h-6 w-6 text-zinc-400" />
									</div>
									<div className="text-sm text-zinc-400 mb-2">Upload album artwork</div>
									<Button variant="outline" size="sm" className="text-xs">
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					<Input
						value={newAlbum.title}
						onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
						placeholder="Album Title"
						className="bg-zinc-800 border-zinc-700"
					/>
					<Input
						value={newAlbum.artist}
						onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
						placeholder="Artist"
						className="bg-zinc-800 border-zinc-700"
					/>
					<Input
						type="number"
						min={1900}
						max={new Date().getFullYear()}
						value={newAlbum.releaseYear}
						onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
						placeholder="Release Year"
						className="bg-zinc-800 border-zinc-700"
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
					>
						{isLoading ? "Creating..." : "Add Album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddAlbumDialog;
