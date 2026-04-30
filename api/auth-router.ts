import * as cookie from "cookie";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicMutation } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { upsertUser, findUserByUnionId } from "./queries/users";

// Hardcoded admin credentials — change these!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export const authRouter = createRouter({
  login: publicMutation
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.username !== ADMIN_USERNAME || input.password !== ADMIN_PASSWORD) {
        throw new Error("Invalid username or password");
      }

      // Upsert a local admin user
      await upsertUser({
        unionId: "local-admin",
        name: ADMIN_USERNAME,
        avatar: "",
        lastSignInAt: new Date(),
      });

      const token = await signSessionToken({
        unionId: "local-admin",
        clientId: "local",
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: (opts.sameSite?.toLowerCase() ?? "lax") as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      const user = await findUserByUnionId("local-admin");
      return user;
    }),

  me: authedQuery.query((opts) => opts.ctx.user),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: (opts.sameSite?.toLowerCase() ?? "lax") as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
