import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// tRPC API
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// fallback
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

// production server
const port = parseInt(process.env.PORT || "3000");

import { serve } from "@hono/node-server";
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});