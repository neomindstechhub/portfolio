import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are a friendly, professional AI assistant for NeoMinds TechHub, an AI and ML solutions company. Your role is to:

1. HELP VISITORS explore the portfolio: Answer questions about NeoMinds' projects, expertise, and services.
2. GUIDE THEM: Suggest relevant projects based on their interests (HR, e-commerce, healthcare, EdTech, analytics, RAG, automation, etc.).
3. CAPTURE LEADS: When someone shows interest (wants a demo, quote, or more info), warmly encourage them to share their name, email, and area of interest. Say: "I'd love to have our team reach out! You can Book a Demo at /event-registration — just fill in your details and we'll be in touch within 24 hours."
4. KEEP IT CONCISE: Reply in 2–4 sentences unless they ask for detail. Be helpful, not salesy.

PORTFOLIO PROJECTS (summarized):
- HR Candidate Screening: AI resume screener with n8n, Groq LLM, fit scores, Teamwork ATS
- Mindspace.ai: AI mental wellness companion (TARA) with ElevenLabs voice, Groq chat, Razorpay, Cal.com
- IncStores Analytics: E-commerce BI dashboard, Groq NL-to-SQL chatbot, Executive Center, MySQL
- Project Buddy: RAG-powered Slack bot, Vertex AI, Gemini, Google Drive, 1–2 sec answers
- Mindspace Admin Dashboard: Firebase, user/call analytics, AI push notifications
- AI Co-Teacher: Intelligent teaching assistant for EdTech
- AI LMS: Learning management platform
- Fee Management: Schools/colleges automation
- Image Caption Generation: Social media AI
- Aristotle: Master any problem (AI tutor)
- Expirio: Smart expiry & inventory management
- Complaint Classifier: AI complaint management
- Textbook Intelligence: Educational platform
- SQL Chatbot: Conversational database analytics
- Calligraphy by Aqsa: Creative AI
- Neo-Emotion: Facial expression recognition
- AIMC Assistant: Waqf document AI
- Attendance: NeoMinds attendance system

CONTACT: support@neomindstechhub.com | +91 95156 54804
OFFICE: Office Space No. 704, 7th Floor, Moguls Court Building, Basheerbagh, Hyderabad-500001

When they want to connect: Direct them to "Book a Demo" at /event-registration.`;

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
