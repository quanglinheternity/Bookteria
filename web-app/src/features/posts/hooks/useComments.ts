import { useState, useCallback } from "react"
import { commentService } from "../services/comment.service"
import { CommentResponse, CommentCreationRequest } from "../types/comment.type"
import { useToast } from "@/hooks/ui/useToast"

export function useComments(postId: string) {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchComments = useCallback(async (page = 1, size = 10) => {
    try {
      setIsLoading(true)
      const response = await commentService.getCommentsByPost(postId, page, size)
      if (response.code === 1000) {
        const { data, currentPage, totalPages, totalElements, pageSize } = response.result
        setComments(prev => page === 1 ? data : [...prev, ...data])
        setPagination({ currentPage, totalPages, totalElements, pageSize })
      }
    } catch (error) {
      console.error("Fetch comments error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  const addComment = async (content: string, parentId?: string): Promise<CommentResponse | null> => {
    try {
      const request: CommentCreationRequest = {
        postId,
        parentId,
        content
      }
      const response = await commentService.createComment(request)
      if (response.code === 1000) {
        // If it's a top-level comment, add to start
        if (!parentId) {
          setComments(prev => [response.result, ...prev])
        } else {
          // Update reply count for the parent comment in the local state
          setComments(prev => prev.map(c => 
            c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c
          ))
        }
        return response.result
      }
      return null
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi bình luận",
        variant: "destructive"
      })
      return null
    }
  }

  const likeComment = async (commentId: string) => {
    try {
      await commentService.likeComment(commentId)
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likeCount: c.likeCount + 1, isLiked: true } : c
      ))
      return true
    } catch (error) {
      return false
    }
  }

  const unlikeComment = async (commentId: string) => {
    try {
      await commentService.unlikeComment(commentId)
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likeCount: Math.max(0, c.likeCount - 1), isLiked: false } : c
      ))
      return true
    } catch (error) {
      return false
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const response = await commentService.deleteComment(commentId)
      if (response.code === 1000 || response.message === "Comment deleted") {
        setComments(prev => prev.filter(c => c.id !== commentId))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  return {
    comments,
    isLoading,
    fetchComments,
    addComment,
    likeComment,
    unlikeComment,
    deleteComment,
    loadMore: () => {
      if (pagination.currentPage < pagination.totalPages) {
        fetchComments(pagination.currentPage + 1, pagination.pageSize)
      }
    },
    hasMore: pagination.currentPage < pagination.totalPages,
    pagination
  }
}
