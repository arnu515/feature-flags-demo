"use client";

import { createPost } from "@/lib/actions";
import { cn } from "@/lib/util";
import { useState, type FormEvent } from "react";

export interface Props {
  parentId?: string;
  isComment?: boolean;
  username: string;
}

export default function PostForm({
  parentId,
  isComment = false,
  username,
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    setPending(true);
    const { error = "" } =
      (await createPost(fd.get("content"), isComment, parentId)) || {};
    setPending(false);
    setError(error);
  }

  return (
    <form className="flex flex-col w-full gap-2" onSubmit={submit}>
      {error && (
        <div className="border border-red-500 bg-red-500/50 text-red-500 px-4 py-2 rounded-lg w-full">
          {error}
        </div>
      )}
      <textarea
        className="resize-none"
        rows={3}
        name="content"
        aria-label="Enter post text"
        placeholder={`${isComment ? "Add a comment" : "Create new post"} as @${username}`}
        required
        maxLength={512}
        minLength={4}
      />
      <div className="flex items-center gap-4 justify-end">
        <a href="/logout" className="link text-red-500">
          Log out
        </a>
        <button className={cn("btn", pending && "pending")}>
          {isComment ? "Add comment" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
