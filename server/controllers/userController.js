import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";


// API Controller Fuction to Get User Bookings
export const getUserBookings = async (req,res) =>{
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId }).populate({
      path : "show",
      populate: {path: "movie"}
    }).sort({createdAt: -1})
    res.json({success:true, bookings})
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}


// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    // 1. Function ki tarah call karein
    const { userId } = req.auth(); 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { movieId } = req.body;
    if (!movieId) {
       return res.json({ success: false, message: "Movie ID is required" });
    }

    const user = await clerkClient.users.getUser(userId);
    
    // Optional Chaining use karein taaki undefined error na aaye
    let favorites = user.privateMetadata?.favorites || [];

    if (favorites.includes(movieId)) {
      favorites = favorites.filter((id) => id !== movieId);
    } else {
      favorites.push(movieId);
    }

    // Update Metadata
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favorites },
    });

    res.json({ success: true, message: "Updated Favorites", favorites });

  } catch (error) {
    console.error("Update Favorite Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getFavorite = async (req, res) => {
  try {
    const { userId } = req.auth(); // Use as function

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata?.favorites || [];

    // Agar favorites empty hai toh DB call karne ki zarurat nahi
    if (favorites.length === 0) {
       return res.json({ success: true, movies: [] });
    }

    const movies = await Movie.find({
      _id: { $in: favorites },
    });

    res.json({ success: true, movies });
  } catch (error) {
    console.error("Get Favorite Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};