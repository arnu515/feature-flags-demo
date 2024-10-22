import sql from "@/lib/db";
import BackButton from "../BackButton";
import Form from "./form";
import { getUser } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function Edit({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const user = await getUser();
  if (!user) notFound();
  const post = (
    await sql`SELECT content FROM posts WHERE id = ${slug} AND user_id = ${user.id} AND created_at >= NOW() - INTERVAL '30 min'`
  )[0];
  if (!post) notFound();
  return (
    <>
      <div className="flex items-center gap-4 my-4">
        <BackButton />
        <h3 className="text-xl">Edit your post</h3>
      </div>

      <Form postId={slug} initialContent={post.content} />
    </>
  );
}
