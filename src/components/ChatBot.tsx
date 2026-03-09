import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hi! I'm the NeoMinds AI assistant. I can tell you about our projects—HR automation, e-commerce analytics, RAG chatbots, EdTech, mental wellness, and more. What would you like to know? Or **Book a Demo** if you're ready to connect!";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamContent]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setStreaming(true);
    setStreamContent("");

    try {
      const chatHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Failed");
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  full += parsed.text;
                  setStreamContent(full);
                }
              } catch {
                /* skip */
              }
            }
          }
        }
      }

      setMessages((m) => [...m, { role: "assistant", content: full || "Sorry, I couldn't get a response. Try again!" }]);
    } catch {
      const isLocal = window.location.hostname === "localhost";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: isLocal
            ? "Chat API not available in local dev. Use 'npm run dev:vercel' to test, or Book a Demo to connect."
            : "Connection error. Please try again or Book a Demo to connect directly.",
        },
      ]);
    } finally {
      setStreaming(false);
      setStreamContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const parseContent = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{p}</strong> : p
    );
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none sm:pointer-events-none"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-50 right-4 bottom-20 left-4 sm:left-auto sm:bottom-4 sm:w-[400px] sm:max-w-[calc(100vw-2rem)] sm:max-h-[min(560px,80vh)] h-[min(520px,85vh)] flex flex-col rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">NeoMinds AI</h3>
              <p className="text-xs text-muted-foreground">Ask about our work</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden min-h-0">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-white/10 text-foreground rounded-bl-md border border-white/5"
                }`}
              >
                <p className="text-sm sm:text-body leading-relaxed whitespace-pre-wrap">
                  {parseContent(m.content)}
                </p>
              </div>
            </div>
          ))}
          {streaming && streamContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-white/10 border border-white/5">
                <p className="text-sm sm:text-body leading-relaxed whitespace-pre-wrap">
                  {parseContent(streamContent)}
                  <span className="inline-block w-2 h-4 bg-primary/80 ml-0.5 animate-pulse" />
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* CTA */}
        <div className="px-4 py-2 border-t border-white/5 shrink-0">
          <Link
            to="/event-registration"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/20 text-primary font-medium text-sm hover:bg-primary/30 transition-colors mb-3"
          >
            Book a Demo
          </Link>
        </div>

        {/* Input */}
        <div className="p-4 pt-0 shrink-0">
          <div className="flex gap-2 items-end rounded-xl border border-white/10 bg-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our projects..."
              rows={1}
              className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none text-sm min-h-[48px] max-h-24"
              disabled={streaming}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-cta-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label={open ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </>
  );
}
