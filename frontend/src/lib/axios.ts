import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development"
		? "http://localhost:5000/api"
		: "https://ayush-music-app-4.onrender.com/api",
});