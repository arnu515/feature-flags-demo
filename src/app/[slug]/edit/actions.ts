"use server";

import { z } from "zod";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import sql from "@/lib/db";

export async function editPost(id: string, unsanitizedContent: unknown) {
  const {
    success,
    data: content,
    error: contentError,
  } = z
    .string({ required_error: "Please enter some text" })
    .max(512, "Post's content must be a maximum of 512 characters long.")
    .min(4, "Post content must be atleast 4 characters long.")
    .trim()
    .safeParse(unsanitizedContent);
  if (!success) return { error: contentError.errors.join("\n") };

  const user = await getUser();
  if (!user) redirect("/auth");

  try {
    const { count } =
      await sql`UPDATE posts SET content=${content} WHERE id = ${id.trim()} AND user_id = ${user.id} AND created_at >= NOW() - INTERVAL '30 min'`;
    if (count === 0)
      throw new Error("You do not have permission to edit this post.");
  } catch (e) {
    console.error(e);
    return {
      error: "An error occured: " + ((e as any).message || "Unknown error"),
    };
  }

  redirect(`/${id}`);
}
