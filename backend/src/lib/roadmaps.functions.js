import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => {
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
    const { data: row, error } = await context.supabase
      .from("roadmaps")
      .insert({
        user_id: context.userId,
        title: ai.title || data.goal,
        goal: `${data.goal} — ${data.months} month${data.months > 1 ? "s" : ""}`,
        level: data.level,
        modules: ai.modules || [],
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listRoadmaps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("roadmaps")
      .select("id, title, goal, level, modules, completed_lessons, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const getRoadmap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("roadmaps").select("*").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    return row;
  });

export const toggleLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({ id: String(data.id), lessonId: String(data.lessonId) }))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase.from("roadmaps").select("completed_lessons").eq("id", data.id).single();
    const done = new Set(row?.completed_lessons || []);
    done.has(data.lessonId) ? done.delete(data.lessonId) : done.add(data.lessonId);
    const completed = [...done];
    const { error } = await context.supabase.from("roadmaps").update({ completed_lessons: completed }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return completed;
  });

export const saveQuizScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({ id: String(data.id), moduleIndex: Number(data.moduleIndex), score: Number(data.score) }))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase.from("roadmaps").select("quiz_scores").eq("id", data.id).single();
    const scores = { ...(row?.quiz_scores || {}), [data.moduleIndex]: data.score };
    const { error } = await context.supabase.from("roadmaps").update({ quiz_scores: scores }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return scores;
  });

export const deleteRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("roadmaps").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getLessonContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    regen: Boolean(data.regen),
  }))
  .handler(async ({ data, context }) => {
    const { data: row, error: readErr } = await context.supabase
      .from("roadmaps").select("goal, level, modules").eq("id", data.id).single();
    if (readErr) throw new Error(readErr.message);
    const modules = row.modules || [];
    const mod = modules[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    if (!data.regen && lesson.content && lesson.content.trim()) {
      return { content: lesson.content, saved: true };
    }
    const { generateLessonContent } = await import("./ai.server.js");
    const content = await generateLessonContent({
      goal: row.goal,
      level: row.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
    });
    // Do NOT persist automatically — user chooses via Save.
    return { content, saved: false };
  });

export const saveLessonContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    content: String(data.content ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const { data: row, error: readErr } = await context.supabase
      .from("roadmaps").select("modules").eq("id", data.id).single();
    if (readErr) throw new Error(readErr.message);
    const modules = row.modules || [];
    const mod = modules[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    lesson.content = data.content;
    const { error: writeErr } = await context.supabase
      .from("roadmaps").update({ modules }).eq("id", data.id);
    if (writeErr) throw new Error(writeErr.message);
    return { ok: true };
  });


export const extendLessonContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => {
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
    const { data: row, error: readErr } = await context.supabase
      .from("roadmaps").select("goal, level, modules").eq("id", data.id).single();
    if (readErr) throw new Error(readErr.message);
    const mod = (row.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const { generateLessonExtension } = await import("./ai.server.js");
    const addition = await generateLessonExtension({
      goal: row.goal,
      level: row.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
      existing: data.existing || lesson.content || "",
      topic: data.topic,
    });
    return { addition };
  });

export const suggestLessonVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    lessonId: String(data.lessonId),
    article: String(data.article ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("roadmaps").select("goal, level, modules").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    const mod = (row.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    const lesson = (mod.lessons || []).find((l) => l.id === data.lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const { generateLessonVideos } = await import("./ai.server.js");
    const videos = await generateLessonVideos({
      goal: row.goal,
      level: row.level,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
      article: data.article || lesson.content || "",
    });
    return { videos };
  });

export const generateModuleQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ({
    id: String(data.id),
    moduleIndex: Number(data.moduleIndex),
    count: Math.max(1, Math.min(40, Number(data.count) || 15)),
  }))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("roadmaps").select("goal, level, modules").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    const mod = (row.modules || [])[data.moduleIndex];
    if (!mod) throw new Error("Module not found");
    const { generateModuleQuiz: gen } = await import("./ai.server.js");
    const quiz = await gen({
      goal: row.goal,
      level: row.level,
      moduleTitle: mod.title,
      moduleSummary: mod.summary,
      lessons: mod.lessons || [],
      count: data.count,
    });
    return { quiz };
  });


