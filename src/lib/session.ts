import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import sql, { type User } from "./db";
import { cache } from "react";

export type Session = { userId: unknown };

export function getSession() {
  return getIronSession<Session>(cookies(), {
    cookieName: "sid",
    password: process.env.SESSION_SECRET || "QJo4fNebC804KMRCrYXCixnKff16IUKz", // atleast 32 chars
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
    ttl: 604800, // 1week
  });
}

export const getUser = cache(async () => {
  const ssn = await getSession();

  if (typeof ssn.userId !== "string") return null;

  // fetch the user from DB
  try {
    const users = await sql<
      User[]
    >`SELECT * FROM users WHERE id = ${ssn.userId}`;
    if (!users[0]) return null;
    return users[0];
  } catch {
    return null;
  }
});
