"use client"

import { useState, useEffect } from "react"
import { PostResponse, Visibility } from "../types/post.type"
import { usePostActions } from "./usePostActions"

export function usePostCard(post: PostResponse, onDelete?: () => void) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post.likeCount)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHideConfirm, setShowHideConfirm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.commentCount)

  const { likePost, unlikePost, updatePost, deletePost } = usePostActions()

  useEffect(() => {
    setIsLiked(post.isLiked || false)
    setLikesCount(post.likeCount)
    setCommentsCount(post.commentCount)
  }, [post.isLiked, post.likeCount, post.commentCount])

  const handleLike = async () => {
    if (isActionLoading) return

    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic UI
    setIsLiked(!previousLiked)
    setLikesCount(prev => previousLiked ? prev - 1 : prev + 1)

    try {
      setIsActionLoading(true)
      const success = previousLiked
        ? await unlikePost(post.id)
        : await likePost(post.id)

      if (!success) {
        setIsLiked(previousLiked)
        setLikesCount(previousCount)
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const confirmDelete = async () => {
    setIsActionLoading(true)
    const success = await deletePost(post.id)
    if (success) {
      onDelete?.()
    }
    setIsActionLoading(false)
    setShowDeleteConfirm(false)
  }

  const confirmHide = async () => {
    setIsActionLoading(true)
    const success = await updatePost(post.id, {
      visibility: Visibility.PRIVATE
    })
    if (success) {
      onDelete?.()
    }
    setIsActionLoading(false)
    setShowHideConfirm(false)
  }

  const nextImage = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex(prev => 
      prev !== null && prev < post.imageUrls.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex(prev => 
      prev !== null && prev > 0 ? prev - 1 : post.imageUrls.length - 1
    )
  }

  return {
    isLiked,
    likesCount,
    isActionLoading,
    selectedImageIndex,
    setSelectedImageIndex,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showHideConfirm,
    setShowHideConfirm,
    showComments,
    setShowComments,
    showDetail,
    setShowDetail,
    commentsCount,
    setCommentsCount,
    handleLike,
    confirmDelete,
    confirmHide,
    nextImage,
    prevImage
  }
}
