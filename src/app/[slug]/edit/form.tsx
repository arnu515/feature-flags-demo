"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/util";
import { editPost } from "./actions";
import Link from "next/link";

export default function Form({
  postId,
  initialContent,
}: {
  postId: string;
  initialContent: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    if (fd.get("content") === initialContent) return;
    setPending(true);
    const { error = "" } =
      (await editPost(postId.trim(), fd.get("content"))) || {};
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
        placeholder={initialContent}
        required
        defaultValue={initialContent}
        maxLength={512}
        minLength={4}
      />
      <div className="flex items-center gap-4 justify-end">
        <Link href={`/${postId}`} replace className="link text-red-500">
          Cancel
        </Link>
        <button className={cn("btn", pending && "pending")}>Save</button>
      </div>
    </form>
  );
}
