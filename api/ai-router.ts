import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const roomsContext = `
AETHERIS Hotel Rooms:
1. Aether Suite - $890/night - 62m² - 2 guests - King bed. Cliff-edge suite with retractable glass facade, travertine soaking tub, private terrace.
2. Olive Villa - $2800/night - 195m² - 4 guests - 2 king beds. Two-bedroom villa with heated plunge pool, al fresco dining, dedicated residence keeper.
3. Sky Loft - $1150/night - 78m² - 2 guests - King bed. Double-height ceilings, mezzanine library, 200° ocean panorama.
4. Sand Studio - $620/night - 42m² - 2 guests - Queen bed. Direct beach access, private timber deck, enclosed outdoor shower.
5. Stone Sanctuary - $1450/night - 92m² - 2 guests - King bed. Cliff-carved suite, copper soaking tub, exposed basalt wall, sunset terrace.
6. Aegean Estate - $3800/night - 350m² - 6 guests - 3 king beds. 25m infinity pool, private chef, three suites, estate manager.

Experiences: Spa treatments, yacht charters, private dining.
Location: Coastal cliffside property with direct beach access.
`;

async function callGroq(messages: { role: string; content: string }[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set in .env");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await res.json() as any;
  return data.choices[0].message.content as string;
}

export const aiRouter = createRouter({

  // ── 1. Hotel Chatbot ─────────────────────────────────────────
  chat: publicQuery
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const reply = await callGroq([
        {
          role: "system",
          content: `You are Aether, the luxury AI concierge for AETHERIS hotel — a mythical coastal sanctuary. 
You are warm, elegant, and knowledgeable. Speak with refined hospitality.
Help guests with: room inquiries, bookings, experiences, local recommendations, hotel amenities.
Keep responses concise (2-4 sentences). Never make up prices or details not listed below.

${roomsContext}`,
        },
        ...input.messages,
      ]);
      return { reply };
    }),

  // ── 2. Room Recommendations ──────────────────────────────────
  recommend: publicQuery
    .input(z.object({
      guests: z.number().min(1).max(10),
      budget: z.number().min(0),
      preferences: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const reply = await callGroq([
        {
          role: "system",
          content: `You are a luxury hotel room recommendation engine for AETHERIS hotel.
Given guest requirements, recommend the TOP 2 best matching rooms from the list below.
Respond ONLY in this JSON format (no markdown, no extra text):
{"recommendations":[{"id":"01","title":"Room Name","reason":"Why this room matches","match":"95%"},{"id":"02","title":"Room Name","reason":"Why this room matches","match":"87%"}]}

${roomsContext}`,
        },
        {
          role: "user",
          content: `Guests: ${input.guests}, Budget: $${input.budget}/night, Preferences: ${input.preferences || "none specified"}`,
        },
      ]);

      try {
        const clean = reply.replace(/```json|```/g, "").trim();
        return JSON.parse(clean) as { recommendations: { id: string; title: string; reason: string; match: string }[] };
      } catch {
        return { recommendations: [] };
      }
    }),

  // ── 3. Booking Assistant ─────────────────────────────────────
  bookingAssist: publicQuery
    .input(z.object({
      message: z.string(),
      context: z.object({
        roomId: z.string().optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        guests: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const ctx = input.context ?? {};
      const reply = await callGroq([
        {
          role: "system",
          content: `You are a smart booking assistant for AETHERIS hotel.
Help guests complete their reservation. Extract booking details from conversation.
Current booking context: Room: ${ctx.roomId ?? "not selected"}, Check-in: ${ctx.checkIn ?? "not set"}, Check-out: ${ctx.checkOut ?? "not set"}, Guests: ${ctx.guests ?? "not set"}.
Respond in JSON format ONLY:
{"message":"Your helpful response here","extracted":{"roomId":"if mentioned","checkIn":"YYYY-MM-DD if mentioned","checkOut":"YYYY-MM-DD if mentioned","guests":"number if mentioned","fullName":"if mentioned","email":"if mentioned"},"readyToBook":false}
Set readyToBook to true only when you have: roomId, checkIn, checkOut, guests, fullName, email.

${roomsContext}`,
        },
        { role: "user", content: input.message },
      ]);

      try {
        const clean = reply.replace(/```json|```/g, "").trim();
        return JSON.parse(clean) as {
          message: string;
          extracted: Record<string, string>;
          readyToBook: boolean;
        };
      } catch {
        return { message: reply, extracted: {}, readyToBook: false };
      }
    }),
});
