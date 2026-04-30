import { useState, useRef, useEffect } from "react";
import { trpc } from "@/providers/trpc";

type Message = { role: "user" | "assistant"; content: string };

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to AETHERIS. I'm Aether, your personal concierge. How may I assist you today?" }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await chatMutation.mutateAsync({ messages: newMessages });
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I apologise, I'm having trouble connecting. Please try again." }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", fontSize: "22px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
        }}
        title="Chat with Aether"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "96px", right: "28px", zIndex: 9998,
          width: "360px", height: "500px", borderRadius: "16px",
          background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)"
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#141414" }}>
            <div style={{ color: "#fff", fontWeight: 500, fontSize: "15px" }}>✦ Aether Concierge</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>AI-powered hotel assistant</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "#2a2a2a" : "#1e1e1e",
                  color: "rgba(255,255,255,0.85)", fontSize: "13px", lineHeight: "1.5",
                  border: "1px solid rgba(255,255,255,0.07)"
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", fontStyle: "italic" }}>Aether is typing...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              style={{
                flex: 1, background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "13px", outline: "none"
              }}
            />
            <button
              onClick={send}
              disabled={chatMutation.isPending}
              style={{
                background: "#fff", color: "#000", border: "none", borderRadius: "8px",
                padding: "8px 14px", fontSize: "13px", fontWeight: 500, cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
