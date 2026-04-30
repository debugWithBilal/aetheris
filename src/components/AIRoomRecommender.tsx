import { useState } from "react";
import { trpc } from "@/providers/trpc";

export default function AIRoomRecommender({ onSelectRoom }: { onSelectRoom?: (id: string) => void }) {
  const [guests, setGuests] = useState(2);
  const [budget, setBudget] = useState(1500);
  const [prefs, setPrefs] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; reason: string; match: string }[]>([]);
  const recommendMutation = trpc.ai.recommend.useMutation();

  const run = async () => {
    const res = await recommendMutation.mutateAsync({ guests, budget, preferences: prefs });
    setResults(res.recommendations);
  };

  return (
    <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ color: "#fff", fontSize: "18px", fontWeight: 500, marginBottom: "6px" }}>✦ Find Your Room</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "24px" }}>AI-powered room matching</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>NUMBER OF GUESTS</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1,2,3,4,5,6].map(n => (
              <button key={n} onClick={() => setGuests(n)} style={{
                width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                background: guests === n ? "#fff" : "#1a1a1a", color: guests === n ? "#000" : "#fff",
                cursor: "pointer", fontSize: "13px", fontWeight: 500
              }}>{n}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>MAX BUDGET: ${budget}/night</label>
          <input type="range" min={500} max={4000} step={100} value={budget} onChange={e => setBudget(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#fff" }} />
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px" }}>
            <span>$500</span><span>$4,000</span>
          </div>
        </div>

        <div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>PREFERENCES (optional)</label>
          <input value={prefs} onChange={e => setPrefs(e.target.value)} placeholder="e.g. ocean view, private pool, romantic..."
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
        </div>

        <button onClick={run} disabled={recommendMutation.isPending} style={{
          background: "#fff", color: "#000", border: "none", borderRadius: "8px",
          padding: "12px", fontSize: "14px", fontWeight: 500, cursor: "pointer", width: "100%"
        }}>
          {recommendMutation.isPending ? "Finding your perfect room..." : "Find My Room"}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>AI RECOMMENDATIONS</div>
          {results.map((r, i) => (
            <div key={i} onClick={() => onSelectRoom?.(r.id)} style={{
              background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
              padding: "16px", cursor: onSelectRoom ? "pointer" : "default"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ color: "#fff", fontWeight: 500, fontSize: "14px" }}>{r.title}</div>
                <div style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "11px", padding: "2px 10px", borderRadius: "20px" }}>{r.match} match</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: "1.5" }}>{r.reason}</div>
              {onSelectRoom && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "8px" }}>Click to view room →</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
