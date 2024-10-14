"use server";

import sql, { type User } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ulid } from "ulid";
import z from "zod";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(fd: FormData) {
  const username = fd.get("username"),
    password = fd.get("password"),
    cpassword = fd.get("cpassword");

  const d = z
    .object({
      username: z
        .string({ required_error: "Please enter your username" })
        .max(64, "Username should be atmost 64 chars long")
        .min(4, "Username should be atleast 4 chars long")
        .trim(),
      password: z
        .string({ required_error: "Please enter your password" })
        .max(256, "Password should be atmost 256 characters long")
        .trim(),
      cpassword: z
        .string({ required_error: "Please confirm your password" })
        .max(256, "Confirm Password should be atmost 256 characters long")
        .trim(),
    })
    .safeParse({ username, password, cpassword });
  if (!d.success) return { error: d.error.errors.join("\n") };
  if (d.data.password !== d.data.cpassword)
    return { error: "Passwords don't match" };

  try {
    const user = (
      await sql<
        { id: User["id"] }[]
      >`INSERT INTO users (id, username, password) VALUES (${ulid()}, ${d.data.username}, ${hashSync(d.data.password, genSaltSync(12))}) RETURNING id`
    )[0];
    if (!user) throw new Error();

    const ssn = await getSession();
    ssn.userId = user.id;
    await ssn.save();
  } catch (e) {
    console.error(e);
    return { error: "Username already taken" };
  }

  redirect("/");
}

export async function login(fd: FormData) {
  const username = fd.get("username"),
    password = fd.get("password");

  const d = z
    .object({
      username: z
        .string({ required_error: "Please enter your username" })
        .max(64, "Username should be atmost 64 chars long")
        .min(4, "Username should be atleast 4 chars long")
        .trim(),
      password: z
        .string({ required_error: "Please enter your password" })
        .max(256, "Password should be atmost 256 characters long")
        .trim(),
    })
    .safeParse({ username, password });
  if (!d.success) return { error: d.error.errors.join("\n") };

  try {
    const user = (
      await sql<
        { id: User["id"]; password: User["password"] }[]
      >`SELECT id, password FROM users WHERE username = ${d.data.username}`
    )[0];
    if (!user) throw new Error();

    if (!compareSync(d.data.password, user.password))
      return { error: "Incorrect password" };

    const ssn = await getSession();
    ssn.userId = user.id;
    await ssn.save();
  } catch (e) {
    console.error(e);
    return { error: "This user does not exist" };
  }

  redirect("/");
}
