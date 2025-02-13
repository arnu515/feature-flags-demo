"use server";

import { z } from "zod";
import { getUser } from "./session";
import { redirect } from "next/navigation";
import sql from "./db";
import { ulid } from "ulid";
import { revalidatePath } from "next/cache";

export async function createPost(
  unsanitizedContent: unknown,
  is_comment: boolean,
  parentId?: string,
) {
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

  const id = ulid();
  try {
    await sql`insert into posts ${sql({ id, content, user_id: user.id, parent_id: parentId ?? null, is_comment })}`;
  } catch (e) {
    console.error(e);
    return {
      error: "An error occured: " + ((e as any).message || "Unknown error"),
    };
  }

  if (!is_comment) redirect(`/${id}`);
  else revalidatePath(`/${parentId}`);
}

export async function likePost(postId: string, like: boolean) {
  const user = await getUser();
  if (!user) redirect("/auth");
  try {
    let numRows: number;
    if (like) numRows = (await sql`insert into likes ${sql({ user_id: user.id, post_id: postId })} on conflict do nothing`).count
    else numRows = (await sql`delete from likes where user_id = ${user.id} and post_id = ${postId}`).count
    if (numRows != 1) return {success: false, error: ""}
    revalidatePath(`/${postId}`)
  } catch (e) {
    console.error(e);
    return {
      error: "An error occured: " + ((e as any).message || "Unknown error"),
      success: false
    };
  } 
} 

