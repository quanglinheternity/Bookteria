"use client"

import { useState } from "react"
import { postService } from "../services/post.service"
import { PostCreationRequest, PostUpdateRequest } from "../types/post.type"
import { useToast } from "@/hooks/ui/useToast"

export function usePostActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const createPost = async (data: PostCreationRequest) => {
    try {
      setIsSubmitting(true)
      const response = await postService.createPost(data)
      if (response.code === 200 || response.code === 1000) {
        toast.success("Thành công", "Bài viết của bạn đã được đăng!")
        return response.result
      }
    } catch (err) {
      console.error("Error creating post:", err)
      toast.error("Lỗi", "Không thể đăng bài viết lúc này")
    } finally {
      setIsSubmitting(false)
    }
    return null
  }

  const likePost = async (postId: string) => {
    try {
      const response = await postService.likePost(postId)
      return response.code === 200 || response.code === 1000
    } catch (err) {
      console.error("Error liking post:", err)
      return false
    }
  }

  const unlikePost = async (postId: string) => {
    try {
      const response = await postService.unlikePost(postId)
      return response.code === 200 || response.code === 1000
    } catch (err) {
      console.error("Error unliking post:", err)
      return false
    }
  }

  const updatePost = async (postId: string, data: PostUpdateRequest) => {
    try {
      setIsSubmitting(true)
      const response = await postService.updatePost(postId, data)
      if (response.code === 200 || response.code === 1000) {
        toast.success("Thành công", "Đã cập nhật bài viết")
        return true
      }
    } catch (err) {
      console.error("Error updating post:", err)
      toast.error("Lỗi", "Không thể cập nhật bài viết")
    } finally {
      setIsSubmitting(false)
    }
    return false
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await postService.deletePost(postId)
      if (response.code === 200 || response.code === 1000) {
        toast.success("Thành công", "Đã xóa bài viết")
        return true
      }
    } catch (err) {
      console.error("Error deleting post:", err)
      toast.error("Lỗi", "Không thể xóa bài viết")
    }
    return false
  }

  const uploadMedia = async (file: File) => {
    try {
      const response = await postService.uploadMedia(file)
      if (response.code === 200 || response.code === 1000) {
        return response.result.url
      }
    } catch (err) {
      console.error("Error uploading media:", err)
      toast.error("Lỗi", "Không thể tải lên tệp tin")
    }
    return null
  }

  return {
    createPost,
    updatePost,
    likePost,
    unlikePost,
    deletePost,
    uploadMedia,
    isSubmitting
  }
}
