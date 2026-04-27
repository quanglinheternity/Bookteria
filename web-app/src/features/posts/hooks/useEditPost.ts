"use client"

import { useState, useEffect } from "react"
import { PostResponse } from "../types/post.type"
import { usePostActions } from "./usePostActions"

export function useEditPost(post: PostResponse, onSuccess?: () => void, onOpenChange?: (open: boolean) => void) {
  const [content, setContent] = useState(post.content)
  const [imageUrls, setImageUrls] = useState<string[]>(post.imageUrls || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updatePost, uploadMedia } = usePostActions()

  useEffect(() => {
    setContent(post.content)
    setImageUrls(post.imageUrls || [])
  }, [post])

  const handleUpdate = async () => {
    if (!content.trim() && imageUrls.length === 0) return

    try {
      setIsSubmitting(true)
      const success = await updatePost(post.id, {
        content,
        imageUrls,
        postType: post.postType,
        visibility: post.visibility
      })

      if (success) {
        onOpenChange?.(false)
        onSuccess?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const url = await uploadMedia(files[i])
      if (url) {
        setImageUrls(prev => [...prev, url])
      }
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  return {
    content,
    setContent,
    imageUrls,
    isSubmitting,
    handleUpdate,
    handleFileUpload,
    removeImage
  }
}
