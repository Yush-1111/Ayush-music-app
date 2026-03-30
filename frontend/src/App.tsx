import { Routes, Route } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

// Pages & Layouts
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SongPage from "./pages/song/SongPage";
import GetSong from "./pages/songs/GetSong";
import NotFoundPage from "./pages/404/NotFoundPage";
import { useEffect } from "react";
import CreatePlaylist from "./pages/addSong/CreatePlaylist";

const AdminPageWrapper = () => {
	useEffect(() => window.scrollTo(0, 0), []);
	return <AdminPage />;
};

export default function App() {
	return (
		<>
			<Routes>
				{/* Clerk SSO & Auth */}
				<Route
					path="/sso-callback"
					element={
						<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />
					}
				/>
				<Route path="/auth-callback" element={<AuthCallbackPage />} />

				{/* Admin */}
				<Route path="/admin" element={<AdminPageWrapper />} />

				{/* Main Layout */}
				<Route element={<MainLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/albums/:albumId" element={<AlbumPage />} />

					{/* Songs */}
					<Route path="/getsong" element={<GetSong />} />
					<Route path="/songs/:songId" element={<SongPage />} />

                    <Route path="/createPlaylist" element={<CreatePlaylist/>} />

					{/* 404 */}
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>

			<Toaster />
		</>
	);
}
