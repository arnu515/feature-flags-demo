"use client";

import type { Post, User } from "@/lib/db";
import { getRelativeDateString } from "@/lib/util";
import { useRouter } from "next/navigation";

export type PropPost =
  | (Omit<Post, "parent_id"> & {
      username: User["username"];
      likes_count: string;
      comments_count: string;
      parent_id: null;
    })
  | (Post & {
      username: User["username"];
      parent_username: User["username"];
      parent_content: Post["content"];
      likes_count: string;
      comments_count: string;
      parent_created_at: Post["created_at"];
    });

export default function Post({ post }: { post: PropPost }) {
  const router = useRouter();
  return (
    <article
      className="flex flex-col gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      onClick={() => router.push(`/${post.id}`)}
    >
      <header className="flex items-center justify-between">
        <span className="font-bold text-sm">@{post.username}</span>
        <span
          className="text-gray-500 text-sm"
          title={post.created_at.toISOString()}
        >
          {getRelativeDateString(post.created_at)}
        </span>
      </header>
      <p className="text-lg">{post.content}</p>
      {post.parent_id && !post.is_comment && (
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
      )}
      {post.likes_count && post.comments_count && (
        <footer className="flex gap-2 px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          {post.likes_count}
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
      )}
    </article>
  );
}
