import { createMiddleware } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";
import { verifyToken } from "./auth.js";
import { connectToDatabase } from "./db.js";

export const requireAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    let token = getCookie("auth_token");

    if (!token) {
      const authHeader = getRequestHeader("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error("Unauthorized: Invalid token");
    }

    await connectToDatabase();

    return next({
      context: {
        userId: decoded.userId,
      },
    });
  }
);
