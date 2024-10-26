"use client"

import { likePost } from "@/lib/actions"
import { useState } from "react"

export interface Props {
  isLiked: boolean
  num: string
  postId: string
}

export default function LikeButton({isLiked, num, postId}: Props) {
  const [pending, setPending] = useState(false)

  async function toggleLike() {
    if (pending) return
    setPending(true)
    const { error="", success=true } = (await likePost(postId, !isLiked)) || {}
    setPending(false)
    if (!success) error && alert(error)
  }
  
  return (
    <button className="flex items-center gap-2 hover:brightness-110" onClick={toggleLike} disabled={pending}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? "currentColor" : "none"}
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
      {pending ? "..." : num}
    </button>
  )
}
