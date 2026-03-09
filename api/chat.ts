import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are a minimal, helpful AI assistant for NeoMinds TechHub (AI & ML solutions). Rules:

1. KEEP IT SHORT: 1–3 sentences. No long paragraphs unless they ask for detail.
2. DISCUSS SERVICES: We build AI for HR, e-commerce, EdTech, healthcare, RAG chatbots, analytics, automation. Mention 1–2 relevant projects when helpful.
3. GATHER INFO: When they show interest, ask one thing at a time: "What's your name?" then "Email?" then "What area are you exploring?" Then: "I'll pass this to our team. Book a Demo to confirm—we respond within 24 hours."
4. TONE: Friendly, minimal, not salesy. Answer briefly, then ask a simple follow-up when relevant.

Key projects: HR screening, Mindspace.ai (mental wellness), IncStores (e-commerce BI), Project Buddy (RAG/Slack), AI Co-Teacher, AI LMS, Fee Management, RAG chatbots, analytics.
Contact: support@neomindstechhub.com | /event-registration for Book a Demo.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Chat API not configured" });
  }

  const { messages } = req.body as { messages?: { role: string; content: string }[] };
  if (!messages?.length) {
    return res.status(400).json({ error: "Messages required" });
  }

  try {
    const groq = new Groq({ apiKey });
    const stream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_completion_tokens: 2048,
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? "";
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
}
