import PostForm from "@/components/PostForm";
import sql from "@/lib/db";
import { getUser } from "@/lib/session";
import Post, { type PropPost } from "@/components/Post";

function getPosts() {
  return sql<
    PropPost[]
  >`SELECT p.id, p.content, p.parent_id, p.user_id, p.is_comment, p.created_at, u.username, par.content as parent_content, par.created_at as parent_created_at, (SELECT us.username as parent_username FROM users us WHERE us.id = par.user_id), (SELECT count(id) as comments_count FROM posts child WHERE child.parent_id = p.id AND child.is_comment = true), (SELECT count(id) as likes_count FROM likes WHERE likes.post_id = p.id) FROM posts p INNER JOIN users u ON p.user_id = u.id LEFT JOIN posts par ON par.id = p.parent_id WHERE p.is_comment = false ORDER BY p.created_at DESC`;
}

export default async function Index() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]);
  return (
    <>
      {user ? (
        <PostForm username={user.username} />
      ) : (
        <a href="/auth" className="btn">
          Sign up to create a post
        </a>
      )}
      <h1 className="text-2xl font-medium mt-8 mb-4">Posts</h1>
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
