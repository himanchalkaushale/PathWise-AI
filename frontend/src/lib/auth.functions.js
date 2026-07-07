import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie } from "@tanstack/react-start/server";
import { connectToDatabase } from "./db.js";
import { User } from "../models/User.js";
import { hashPassword, comparePassword, signToken, verifyToken } from "./auth.js";

export const signUp = createServerFn({ method: "POST" })
  .validator((data) => ({
    email: String(data.email),
    password: String(data.password),
  }))
  .handler(async ({ data }) => {
    await connectToDatabase();
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new Error("Email already in use");
    }

    const passwordHash = await hashPassword(data.password);
    const user = await User.create({ email: data.email, passwordHash });

    const token = signToken({ userId: user._id });

    // Set cookie
    setCookie("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { user: { id: user._id.toString(), email: user.email } };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator((data) => ({
    email: String(data.email),
    password: String(data.password),
  }))
  .handler(async ({ data }) => {
    await connectToDatabase();
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = signToken({ userId: user._id });

    // Set cookie
    setCookie("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { user: { id: user._id.toString(), email: user.email } };
  });

export const signOut = createServerFn({ method: "POST" })
  .handler(async () => {
    setCookie("auth_token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return { ok: true };
  });

export const getSession = createServerFn({ method: "GET" })
  .handler(async () => {
    const token = getCookie("auth_token");
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) return null;

    return { session: true, user: { id: user._id.toString(), email: user.email } };
  });
