// Server-only helper that calls the user's custom OpenAI-compatible AI endpoint.

async function callAI({ prompt, timeoutMs = 90_000, json = true, maxTokens }) {
  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) throw new Error("AI endpoint not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    };
    if (json) body.response_format = { type: "json_object" };
    if (maxTokens) body.max_tokens = maxTokens;
    res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw new Error(`AI request timed out after ${Math.round(timeoutMs / 1000)}s.`);
    throw e;
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error(`AI request failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!json) return text;
  return parseJsonLoose(text);
}

function parseJsonLoose(text) {
  let s = String(text).trim();
  // strip ```json ... ``` fences
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = s.search(/[\{\[]/);
  const openCh = start !== -1 ? s[start] : null;
  const closeCh = openCh === "[" ? "]" : "}";
  const end = s.lastIndexOf(closeCh);
  if (start !== -1 && end !== -1) s = s.substring(start, end + 1);
  try {
    return JSON.parse(s);
  } catch {
    const cleaned = s.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/[\x00-\x1F\x7F]/g, (c) => (c === "\n" || c === "\t" ? c : ""));
    return JSON.parse(cleaned);
  }
}


// FAST skeleton: modules + lesson titles + quizzes only. No lesson content yet.
// This dramatically reduces output tokens (the main latency driver).
export async function generateRoadmap({ goal, level, months = 3 }) {
  const m = Number(months) || 3;
  const moduleCount = Math.max(4, Math.min(8, Math.round(m * 1.2) + 3));

  const prompt = `You are an expert learning designer. Build a week-by-week learning roadmap SKELETON.
Timeline: ${m} month${m > 1 ? "s" : ""}. Exactly ${moduleCount} progressive modules.
Return STRICT JSON only (no markdown), matching this schema:
{
  "title": "short catchy title (max 60 chars)",
  "modules": [
    {
      "title": "module title",
      "summary": "one-sentence outcome",
      "duration": "e.g. Week 1-2",
      "lessons": [
        { "id": "m1l1", "title": "lesson title" }
      ]
    }
  ]
}
Rules:
- Exactly ${moduleCount} modules, foundations → capstone.
- 3-4 lessons per module. Only titles, NO content field.
- Do NOT include a "quiz" field. Quizzes are generated separately on demand.
- Lesson ids unique: "m1l1","m1l2","m2l1"...
Goal: ${goal}
Level: ${level}`;

  return callAI({ prompt, timeoutMs: 90_000 });
}

// Generates content for a single lesson on demand.
export async function generateLessonContent({ goal, level, moduleTitle, lessonTitle }) {
  const prompt = `You are writing a full-length, in-depth teaching article for one lesson of a learning roadmap. Write like a high-quality technical blog post or textbook chapter — NOT a short summary.

Goal: ${goal}
Level: ${level}
Module: ${moduleTitle}
Lesson: ${lessonTitle}

Requirements:
- 800-1400 words, real narrative flow.
- Rich GitHub-Flavored Markdown. NO H1 (title already shown). Use ##/### section headings (Overview, Key Concepts, How It Works, Example, Common Pitfalls, Key takeaways, etc.).
- Use **bold**, *italics*, \`inline code\`, bullet lists, numbered steps, and > blockquotes.
- Include at least one fenced code block with a language tag when technical (\`\`\`js, \`\`\`python, \`\`\`bash, ...).
- Use tables when comparing options.
- Use LaTeX math when relevant: inline $...$ and display $$...$$ (KaTeX). Do NOT wrap math in code fences.
- End with a "## Key takeaways" bullet list.

OUTPUT FORMAT — CRITICAL:
Return the article as RAW markdown ONLY. Do NOT wrap the whole response in \`\`\`markdown\`\`\` fences. Do NOT return JSON. Do NOT add any preface like "Here is the article". Start directly with the intro paragraph.`;
  let text = await callAI({ prompt, timeoutMs: 120_000, json: false, maxTokens: 4000 });
  return normalizeMarkdown(text);
}

function normalizeMarkdown(raw) {
  let text = String(raw ?? "").trim();
  if (!text) return "";

  // If the model returned a JSON envelope like {"content":"..."} unwrap it.
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") text = parsed;
      else if (parsed && typeof parsed.content === "string") text = parsed.content;
      else if (parsed && typeof parsed.article === "string") text = parsed.article;
      else if (parsed && typeof parsed.markdown === "string") text = parsed.markdown;
    } catch {
      // not JSON — leave as-is
    }
  }

  // Strip an outer ```markdown / ```md / ``` fence if the whole response is wrapped.
  const outer = text.match(/^```(?:markdown|md|text)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  if (outer) text = outer[1];

  // Convert literal escape sequences into real characters (happens when the
  // model emits JSON-escaped strings without wrapping them in JSON).
  if (!text.includes("\n") && text.includes("\\n")) {
    text = text
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  return text.trim();
}

// Generates ONLY an additional markdown section that extends an existing
// lesson article with the user-requested topic. Returns raw markdown that
// should be appended to the existing content.
export async function generateLessonExtension({
  goal,
  level,
  moduleTitle,
  lessonTitle,
  existing,
  topic,
}) {
  const trimmed = String(existing || "").slice(-6000); // give the model tail context
  const prompt = `You are extending an existing lesson article with an additional section on a specific topic the reader asked about. DO NOT rewrite or repeat what is already in the article — write ONLY the new section that will be appended at the end.

Roadmap goal: ${goal}
Level: ${level}
Module: ${moduleTitle}
Lesson: ${lessonTitle}

User's additional topic to cover:
"""
${topic}
"""

Existing article (for context, DO NOT repeat it):
"""
${trimmed}
"""

Requirements for the new section:
- Start with a "## " heading whose title reflects the requested topic (do NOT use H1).
- 250-600 words of substantive, non-repetitive content that continues the article's tone.
- Rich GitHub-Flavored Markdown: subheadings (###), lists, tables, > blockquotes, **bold**, \`inline code\`.
- Include at least one fenced code block with a language tag if technical.
- Use LaTeX math when relevant: inline $...$ and display $$...$$ (KaTeX). Do NOT wrap math in code fences.
- End with a short "### Takeaways" bullet list (2-4 bullets).

OUTPUT FORMAT — CRITICAL:
Return the new section as RAW markdown ONLY. No JSON, no preface, no outer \`\`\` fences. Start directly with the "## " heading.`;
  const text = await callAI({ prompt, timeoutMs: 90_000, json: false, maxTokens: 1800 });
  return normalizeMarkdown(text);
}

// Generates a fresh multi-question quiz for an entire module.
export async function generateModuleQuiz({ goal, level, moduleTitle, moduleSummary, lessons, count }) {
  const n = Math.max(1, Math.min(40, Number(count) || 15));
  const lessonList = (lessons || []).map((l, i) => `${i + 1}. ${l.title}`).join("\n");
  const prompt = `Create a challenging multiple-choice quiz for the module below.
Return STRICT JSON only:
{ "quiz": [ { "q": "question", "options": ["a","b","c","d"], "answer": 0 } ] }

Rules:
- Exactly ${n} questions.
- Each question has EXACTLY 4 options.
- "answer" is the 0-based index of the correct option.
- Cover the whole module, mixing conceptual, applied and edge-case questions.
- Difficulty tuned for a ${level} learner.
- No duplicates.

Roadmap goal: ${goal}
Module: ${moduleTitle}
${moduleSummary ? `Summary: ${moduleSummary}` : ""}
Lessons:
${lessonList}`;
  const out = await callAI({ prompt, timeoutMs: 120_000, json: true, maxTokens: 4000 });
  const quiz = Array.isArray(out?.quiz) ? out.quiz : [];
  return quiz
    .filter((q) => q && typeof q.q === "string" && Array.isArray(q.options) && q.options.length === 4)
    .slice(0, n)
    .map((q) => ({
      q: String(q.q).trim(),
      options: q.options.map((o) => String(o)),
      answer: Math.max(0, Math.min(3, Number(q.answer) || 0)),
    }));
}


// Suggests YouTube videos for a lesson. Returns [{ title, query, url, ... }].
// We return YouTube SEARCH URLs (not raw video URLs) because the model can't
// verify a specific videoId exists — a search link from a good query always works.
export async function generateLessonVideos({ goal, level, moduleTitle, lessonTitle, article }) {
  const context = String(article || "").slice(0, 4000);
  const prompt = `Suggest 5 high-quality YouTube videos a learner should watch for the lesson below.
Return STRICT JSON only:
{ "videos": [ { "title": "descriptive video title", "query": "exact YouTube search query", "channel": "likely creator (optional)", "why": "one short sentence" } ] }

Rules:
- 5 items, foundational -> advanced.
- "query" MUST be a concise search string (3-10 words). Do NOT invent URLs.
- Prefer well-known educators when relevant (3Blue1Brown, StatQuest, freeCodeCamp, Fireship, MIT OCW, Andrej Karpathy, etc.).
- Match learner level: ${level}.

Roadmap goal: ${goal}
Module: ${moduleTitle}
Lesson: ${lessonTitle}
${context ? `\nArticle excerpt for grounding:\n"""\n${context}\n"""` : ""}`;
  const out = await callAI({ prompt, timeoutMs: 60_000, json: true, maxTokens: 900 });
  const videos = Array.isArray(out?.videos) ? out.videos : [];
  return videos
    .filter((v) => v && typeof v.query === "string" && v.query.trim())
    .slice(0, 6)
    .map((v) => ({
      title: String(v.title || v.query).trim(),
      query: String(v.query).trim(),
      channel: v.channel ? String(v.channel).trim() : "",
      why: v.why ? String(v.why).trim() : "",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(String(v.query).trim())}`,
    }));
}

