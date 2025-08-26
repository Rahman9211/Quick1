import express from "express";
import { getPublishedCreations, getUserCreation, toggleLikeCreation } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";  // ✅ Import auth

const userRoutes = express.Router();

// Get all creations of logged-in user
userRoutes.get('/creations/user', auth, getUserCreation);

// Get all published creations
// userRoutes.get('/creations/published', auth, getPublishedCreations);
userRoutes.get('/get-published-creations', auth, getPublishedCreations);

// Toggle like on a specific creation
userRoutes.post('/toggle-like-creation', auth, toggleLikeCreation);

export default userRoutes;
