import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware.js";
import { Roadmap } from "../models/Roadmap.js";

export const createRoadmap = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => {
    if (!data || typeof data.goal !== "string" || data.goal.trim().length < 3) throw new Error("Goal is required");
    return {
      goal: data.goal.trim(),
      level: data.level || "beginner",
      months: Number(data.months) || 3,
    };
  })
  .handler(async ({ data, context }) => {
    const { generateRoadmap } = await import("./ai.server.js");
    const ai = await generateRoadmap(data);
    
    const roadmap = await Roadmap.create({
      user_id: context.userId,
      title: ai.title || data.goal,
      goal: `${data.goal} — ${data.months} month${data.months > 1 ? "s" : ""}`,
      level: data.level,
      modules: ai.modules || [],
    });
    
    return JSON.parse(JSON.stringify({ ...roadmap.toObject(), id: roadmap._id.toString() }));
  });

export const listRoadmaps = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const roadmaps = await Roadmap.find({ user_id: context.userId })
      .select("id title goal level modules completed_lessons created_at")
      .sort({ created_at: -1 });
    
    return roadmaps.map(r => JSON.parse(JSON.stringify({ ...r.toObject(), id: r._id.toString() })));
  });

export const getRoadmap = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .validator((data) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId });
    if (!roadmap) throw new Error("Roadmap not found");
    return JSON.parse(JSON.stringify({ ...roadmap.toObject(), id: roadmap._id.toString() }));
  });

export const toggleLesson = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({ id: String(data.id), lessonId: String(data.lessonId) }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("completed_lessons");
    if (!roadmap) throw new Error("Roadmap not found");

    const done = new Set(roadmap.completed_lessons || []);
    done.has(data.lessonId) ? done.delete(data.lessonId) : done.add(data.lessonId);
    const completed = [...done];
    
    await Roadmap.updateOne({ _id: data.id }, { completed_lessons: completed });
    return completed;
  });

export const saveQuizScore = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({ id: String(data.id), moduleIndex: Number(data.moduleIndex), score: Number(data.score) }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("quiz_scores");
    if (!roadmap) throw new Error("Roadmap not found");

    const scores = { ...(roadmap.quiz_scores || {}), [data.moduleIndex]: data.score };
    await Roadmap.updateOne({ _id: data.id }, { quiz_scores: scores });
    return scores;
  });

export const deleteRoadmap = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    await Roadmap.deleteOne({ _id: data.id, user_id: context.userId });
    return { ok: true };
  });

export const getLessonContent = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    regen: Boolean(data.regen),
  }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("goal level modules");
    if (!roadmap) throw new Error("Roadmap not found");

    const modules = roadmap.modules || [];
    const mod = modules[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    
    if (!data.regen && lesson.content && lesson.content.trim()) {
      return { content: lesson.content, saved: true };
    }
    
    const { generateLessonContent } = await import("./ai.server.js");
    const content = await generateLessonContent({
      goal: roadmap.goal,
      level: roadmap.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
    });
    return { content, saved: false };
  });

export const saveLessonContent = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    content: String(data.content ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("modules");
    if (!roadmap) throw new Error("Roadmap not found");

    const modules = roadmap.modules || [];
    const mod = modules[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    
    lesson.content = data.content;
    
    await Roadmap.updateOne({ _id: data.id }, { modules });
    return { ok: true };
  });

export const extendLessonContent = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => {
    const topic = String(data?.topic ?? "").trim();
    if (topic.length < 2) throw new Error("Please describe the topic to add.");
    return {
      id: String(data.id),
      moduleIndex: Number(data.moduleIndex),
      lessonId: String(data.lessonId),
      existing: String(data.existing ?? ""),
      topic,
    };
  })
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("goal level modules");
    if (!roadmap) throw new Error("Roadmap not found");

    const mod = (roadmap.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    
    const { generateLessonExtension } = await import("./ai.server.js");
    const addition = await generateLessonExtension({
      goal: roadmap.goal,
      level: roadmap.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
      existing: data.existing || lesson.content || "",
      topic: data.topic,
    });
    return { addition };
  });

export const suggestLessonVideos = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    article: String(data.article ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("goal level modules");
    if (!roadmap) throw new Error("Roadmap not found");

    const mod = (roadmap.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    
    const { generateLessonVideos } = await import("./ai.server.js");
    const videos = await generateLessonVideos({
      goal: roadmap.goal,
      level: roadmap.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
      article: data.article || lesson.content || "",
    });
    return { videos };
  });

export const generateModuleQuiz = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    count: Math.max(1, Math.min(40, Number(data.count) || 15)),
  }))
  .handler(async ({ data, context }) => {
    const roadmap = await Roadmap.findOne({ _id: data.id, user_id: context.userId }).select("goal level modules");
    if (!roadmap) throw new Error("Roadmap not found");

    const mod = (roadmap.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    
    const { generateModuleQuiz: gen } = await import("./ai.server.js");
    const quiz = await gen({
      goal: roadmap.goal,
      level: roadmap.level,
      moduleTitle: mod.title,
      moduleSummary: mod.summary,
      lessons: mod.lessons || [],
      count: data.count,
    });
    return { quiz };
  });
