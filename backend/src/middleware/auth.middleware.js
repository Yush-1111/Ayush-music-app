import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    // ✅ req.auth is already available (set by clerkMiddleware)
    const auth = req.auth;

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    req.auth = auth; // store auth info for controllers
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    // ✅ req.auth is object, no parentheses
    const auth = req.auth;

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    // ✅ Fetch user from Clerk
    const currentUser = await clerkClient.users.getUser(auth.userId);
    const userEmail = currentUser?.primaryEmailAddress?.emailAddress;

    const isAdmin = process.env.ADMIN_EMAIL === userEmail;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - admin access only" });
    }

    req.userId = auth.userId;
    req.userEmail = userEmail;

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
