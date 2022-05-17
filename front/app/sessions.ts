import { createCookieSessionStorage } from "@remix-run/node";

const ONE_WEEK_IN_SECONDS = 604800;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: ONE_WEEK_IN_SECONDS,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET_1!],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
