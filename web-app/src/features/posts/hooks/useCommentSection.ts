"use client"

import { useState, useEffect } from "react"
import { useComments } from "./useComments"
import { CommentResponse } from "../types/comment.type"

export function useCommentSection(postId: string, onCommentCountChange?: (updater: (prev: number) => number) => void) {
  const { 
    comments, 
    isLoading, 
    fetchComments, 
    addComment, 
    likeComment, 
    unlikeComment,
    deleteComment,
    loadMore,
    hasMore
  } = useComments(postId)
  
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestReply, setLatestReply] = useState<{parentId: string, comment: CommentResponse} | null>(null)

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    const result = await addComment(newComment.trim(), replyingTo?.id)
    if (result) {
      if (replyingTo) {
        setLatestReply({ parentId: replyingTo.id, comment: result })
      }
      onCommentCountChange?.((prev: number) => prev + 1)
      setNewComment("")
      setReplyingTo(null)
    }
    setIsSubmitting(false)
  }

  return {
    comments,
    isLoading,
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    isSubmitting,
    latestReply,
    handleSubmit,
    likeComment,
    unlikeComment,
    deleteComment,
    loadMore,
    hasMore
  }
}
