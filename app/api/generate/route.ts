import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a professional narrative editor.
You specialize in dividing personal stories into structured visual slides.

You must:
- Maintain emotional continuity
- Ensure story flows naturally from slide to slide
- Keep each slide 5–7 sentences maximum
- Adapt text length to number of slides
- Balance content evenly
- Keep tone authentic, modern, natural
- Avoid clichés
- Avoid emojis
- Avoid hashtags

Return strictly:
JSON object with a single key "slides" whose value is an array of strings.
Length of array MUST equal the requested number of slides.`;

function buildUserPrompt(
  projectName: string,
  description: string,
  imageCount: number,
  format: string
): string {
  return `Project name: ${projectName}

Full story description:
${description}

Number of slides: ${imageCount}
Format: ${format}

Divide the story into ${imageCount} meaningful slide segments.
Each slide should feel complete but connected to the next.
Return a JSON object with key "slides" containing an array of exactly ${imageCount} strings.`;
}

function parseSlideTexts(raw: string, expectedCount: number): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null) return [];

  if ("slides" in parsed && Array.isArray((parsed as { slides: unknown }).slides)) {
    const slides = (parsed as { slides: unknown[] }).slides;
    return slides
      .filter((x): x is string => typeof x === "string")
      .slice(0, expectedCount);
  }
  if (Array.isArray(parsed)) {
    return parsed
      .filter((x): x is string => typeof x === "string")
      .slice(0, expectedCount);
  }
  const values = Object.values(parsed);
  return values
    .filter((x): x is string => typeof x === "string")
    .slice(0, expectedCount);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Set OPENAI_API_KEY." },
      { status: 500 }
    );
  }

  let body: {
    projectName?: string;
    description?: string;
    imageCount?: number;
    format?: string;
  };

  try {
    const raw = await request.json();
    body = typeof raw === "object" && raw !== null ? raw : {};
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const projectName = typeof body.projectName === "string" ? body.projectName.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const imageCount = typeof body.imageCount === "number" ? Math.max(1, Math.round(body.imageCount)) : 1;
  const format =
    body.format === "carousel" ? "Instagram Carousel (1:1)" : "Instagram Stories (9:16)";

  if (!description) {
    return NextResponse.json(
      { error: "Description is required" },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(projectName, description, imageCount, format),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (rawContent === undefined || rawContent === null || String(rawContent).trim() === "") {
      console.error("[generate] Empty OpenAI response", { completion });
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    const texts = parseSlideTexts(String(rawContent).trim(), imageCount);
    if (texts.length !== imageCount) {
      console.error("[generate] Slide count mismatch", {
        expected: imageCount,
        got: texts.length,
        raw: rawContent,
      });
      return NextResponse.json(
        { error: "Slide count mismatch. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ texts });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate] OpenAI error:", err);

    if (message.includes("401") || message.includes("Incorrect API key")) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 500 }
      );
    }
    if (message.includes("429") || message.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 500 }
      );
    }
    if (message.includes("ENOTFOUND") || message.includes("fetch")) {
      return NextResponse.json(
        { error: "Network error. Check your connection." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate slide texts. Try again." },
      { status: 500 }
    );
  }
}
