import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware.js";
import { z } from "zod";
import { ChatThread } from "../models/ChatThread.js";
import { ChatMessage } from "../models/ChatMessage.js";

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const threads = await ChatThread.find({ user_id: context.userId })
      .select("title updated_at")
      .sort({ updated_at: -1 });
    
    return threads.map(t => ({ id: t._id.toString(), title: t.title, updated_at: t.updated_at }));
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const thread = await ChatThread.create({ user_id: context.userId, title: "New chat" });
    return { id: thread._id.toString(), title: thread.title, updated_at: thread.updated_at };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await ChatThread.deleteOne({ _id: data.id, user_id: context.userId });
    await ChatMessage.deleteMany({ thread_id: data.id });
    return { ok: true };
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((d) =>
    z.object({ id: z.string(), title: z.string().min(1).max(120) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ChatThread.updateOne({ _id: data.id, user_id: context.userId }, { title: data.title });
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .validator((d) => z.object({ threadId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const messages = await ChatMessage.find({ thread_id: data.threadId })
      .select("role content created_at")
      .sort({ created_at: 1 });
      
    return messages.map((m) => ({
      id: m._id.toString(),
      role: m.role,
      parts: [{ type: "text", text: m.content }],
    }));
  });
