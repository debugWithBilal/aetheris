import { useState } from "react";
import { trpc } from "@/providers/trpc";

type BookingContext = {
  roomId?: string; checkIn?: string; checkOut?: string;
  guests?: string; fullName?: string; email?: string;
};

export default function AIBookingAssistant({ initialRoomId }: { initialRoomId?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your booking assistant. Tell me your preferred dates, number of guests, and I'll help you complete your reservation. You can also say things like 'I'd like to book the Sky Loft for 2 people from June 10 to June 14'." }
  ]);
  const [bookingCtx, setBookingCtx] = useState<BookingContext>({ roomId: initialRoomId });
  const [readyToBook, setReadyToBook] = useState(false);

  const reservationMutation = trpc.reservation.create.useMutation();
  const assistMutation = trpc.ai.bookingAssist.useMutation();

  const send = async () => {
    if (!input.trim() || assistMutation.isPending) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    try {
      const res = await assistMutation.mutateAsync({ message: userMsg, context: bookingCtx });
      const merged = { ...bookingCtx, ...Object.fromEntries(Object.entries(res.extracted).filter(([, v]) => v)) };
      setBookingCtx(merged);
      setReadyToBook(res.readyToBook);
      setMessages(prev => [...prev, { role: "assistant", content: res.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble processing that. Please try again." }]);
    }
  };

  const confirmBooking = async () => {
    if (!bookingCtx.fullName || !bookingCtx.email || !bookingCtx.checkIn || !bookingCtx.checkOut) return;
    try {
      await reservationMutation.mutateAsync({
        checkInDate: bookingCtx.checkIn!,
        checkOutDate: bookingCtx.checkOut!,
        guests: bookingCtx.guests ?? "2",
        roomType: bookingCtx.roomId ?? "standard",
        roomId: bookingCtx.roomId,
        fullName: bookingCtx.fullName!,
        email: bookingCtx.email!,
      });
      setMessages(prev => [...prev, { role: "assistant", content: `✓ Your reservation is confirmed! We'll send a confirmation to ${bookingCtx.email}. We look forward to welcoming you to AETHERIS.` }]);
      setReadyToBook(false);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "There was an issue saving your reservation. Please try again or contact us directly." }]);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.15)", color: "#fff",
        borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 500,
        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
      }}>
        <span>✦</span> Book with AI Assistant
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9997,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div style={{
            background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
            width: "100%", maxWidth: "480px", height: "580px", display: "flex", flexDirection: "column", overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 500 }}>✦ Booking Assistant</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>AI-guided reservation</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>

            {/* Booking context pill */}
            {Object.values(bookingCtx).some(Boolean) && (
              <div style={{ padding: "10px 20px", background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {bookingCtx.roomId && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "2px 10px", borderRadius: "20px" }}>Room: {bookingCtx.roomId}</span>}
                {bookingCtx.checkIn && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "2px 10px", borderRadius: "20px" }}>In: {bookingCtx.checkIn}</span>}
                {bookingCtx.checkOut && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "2px 10px", borderRadius: "20px" }}>Out: {bookingCtx.checkOut}</span>}
                {bookingCtx.guests && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "2px 10px", borderRadius: "20px" }}>Guests: {bookingCtx.guests}</span>}
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.role === "user" ? "#2a2a2a" : "#1e1e1e",
                    color: "rgba(255,255,255,0.85)", fontSize: "13px", lineHeight: "1.5",
                    border: "1px solid rgba(255,255,255,0.07)"
                  }}>{m.content}</div>
                </div>
              ))}
              {readyToBook && (
                <button onClick={confirmBooking} disabled={reservationMutation.isPending} style={{
                  background: "#fff", color: "#000", border: "none", borderRadius: "8px",
                  padding: "12px", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", marginTop: "8px"
                }}>
                  {reservationMutation.isPending ? "Confirming..." : "✓ Confirm Reservation"}
                </button>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "8px" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type dates, guests, preferences..."
                style={{ flex: 1, background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "13px", outline: "none" }} />
              <button onClick={send} disabled={assistMutation.isPending} style={{
                background: "#fff", color: "#000", border: "none", borderRadius: "8px",
                padding: "8px 14px", fontSize: "13px", fontWeight: 500, cursor: "pointer"
              }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
