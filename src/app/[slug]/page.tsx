import type { PropPost } from "@/components/Post";
import Post from "@/components/Post";
import sql from "@/lib/db";
import { getUser } from "@/lib/session";
import BackButton from "./BackButton";
import PostForm from "@/components/PostForm";
import LikeButton from "@/components/LikeButton";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getUserPosts(username: string) {
  const user = (
    await sql`SELECT id FROM users WHERE username = ${username}`
  )[0];
  if (!user) notFound();
  return await sql<
    PropPost[]
  >`SELECT p.id, p.content, p.parent_id, p.user_id, p.is_comment, p.created_at, u.username, par.content as parent_content, par.created_at as parent_created_at, (SELECT us.username as parent_username FROM users us WHERE us.id = par.user_id), (SELECT count(id) as comments_count FROM posts child WHERE child.parent_id = p.id AND child.is_comment = true), (SELECT count(*) as likes_count FROM likes WHERE likes.post_id = p.id) FROM posts p INNER JOIN users u ON p.user_id = u.id LEFT JOIN posts par ON par.id = p.parent_id WHERE p.is_comment = false and p.user_id = ${user.id} ORDER BY p.created_at DESC`;
}

async function getPost(postId: string) {
  return (
    (
      await sql<
        PropPost[]
      >`SELECT p.id, p.content, p.parent_id, p.user_id, p.is_comment, p.created_at, u.username, par.content as parent_content, par.created_at as parent_created_at, (SELECT us.username as parent_username FROM users us WHERE us.id = par.user_id), (SELECT count(id) as comments_count FROM posts child WHERE child.parent_id = p.id AND child.is_comment = true), (SELECT count(*) as likes_count FROM likes WHERE likes.post_id = p.id) FROM posts p INNER JOIN users u ON p.user_id = u.id LEFT JOIN posts par ON par.id = p.parent_id WHERE p.id = ${postId}`
    )[0] ?? null
  );
}

function getComments(postId: string) {
  return sql<
    PropPost[]
  >`SELECT p.id, p.content, p.parent_id, p.user_id, p.is_comment, p.created_at, u.username, (SELECT count(id) as comments_count FROM posts child WHERE child.parent_id = p.id AND child.is_comment = true), (SELECT count(*) as likes_count FROM likes WHERE likes.post_id = p.id) FROM posts p INNER JOIN users u ON p.user_id = u.id WHERE p.is_comment = true and p.parent_id = ${postId}`;
}

async function getHasLiked(postId: string, userId?: string) {
  if (!userId) return false;
  return (await sql`SELECT 1 FROM likes WHERE post_id = ${postId} AND user_id = ${userId} LIMIT 1`).count == 1
}

async function Username({ username }: { username: string }) {
  const posts = await getUserPosts(username);
  return (
    <>
      <h1 className="text-2xl font-medium mt-8 mb-4">
        @{username}&apos;s Posts
      </h1>
      {!posts.length ? (
        <p className="text-lg text-gray-500 text-center my-4">
          There are no posts yet.
        </p>
      ) : (
        posts.map((p) => <Post post={p} key={p.id} />)
      )}
    </>
  );
}

async function PostId({ postId }: { postId: string }) {
  const [user, post, comments] = await Promise.all([
    getUser(),
    getPost(postId),
    getComments(postId),
  ]);
  const isLiked = await getHasLiked(post.id, user?.id)
  if (!post) notFound();

  return (
    <>
      {post.parent_id && post.is_comment && (
        <div className="my-4 px-4">
          <Post
            post={{
              id: post.parent_id,
              content: post.parent_content,
              username: post.parent_username,
              created_at: post.parent_created_at,
              parent_id: null,
              user_id: "",
              is_comment: false,
              likes_count: "",
              comments_count: "",
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-4 my-4">
        <BackButton />
        <h3 className="text-xl">
          {post.is_comment && <span className="text-gray-500">In reply, </span>}
          <Link href={`/@${post.username}`} className="font-bold">
            @{post.username}
          </Link>{" "}
          says:
        </h3>
      </div>
      <p className="text-3xl mt-8 mb-4 px-4">{post.content}</p>
      {post.parent_id && !post.is_comment && (
        <div className="my-4 px-4">
          <Post
            post={{
              id: post.parent_id,
              content: post.parent_content,
              username: post.parent_username,
              created_at: post.parent_created_at,
              parent_id: null,
              user_id: "",
              is_comment: false,
              likes_count: "",
              comments_count: "",
            }}
          />
        </div>
      )}
      <footer className="flex gap-2 px-2">
        <LikeButton num={post.likes_count} postId={post.id} isLiked={isLiked} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 ml-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
        {post.comments_count}
      </footer>
      <h3 className="text-lg font-bold mt-8 mb-4">Comments:</h3>
      {user ? (
        <PostForm
          username={user.username}
          parentId={post.id}
          isComment={true}
        />
      ) : (
        <a href="/auth" className="btn block w-max ml-auto">
          Sign up to comment
        </a>
      )}
      <div className="py-2" />
      {!comments.length ? (
        <p className="text-lg text-gray-500 text-center my-4">
          There are no comments yet.
        </p>
      ) : (
        comments.map((p) => <Post post={p} key={p.id} />)
      )}
    </>
  );
}

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  if (slug.startsWith("%40")) return <Username username={slug.slice(3)} />;
  else return <PostId postId={slug} />;
}
