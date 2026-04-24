import { commentApi } from "../api/comment.api"
import { ApiResponse, PageResponse } from "@/features/messages"
import { 
  CommentResponse, 
  CommentCreationRequest, 
  CommentUpdateRequest 
} from "../types/comment.type"

export const commentService = {
  createComment: (request: CommentCreationRequest): Promise<ApiResponse<CommentResponse>> => {
    return commentApi.create(request)
  },

  getCommentsByPost: (postId: string, page?: number, size?: number): Promise<ApiResponse<PageResponse<CommentResponse>>> => {
    return commentApi.getByPostId(postId, page, size)
  },

  getReplies: (commentId: string, page?: number, size?: number): Promise<ApiResponse<PageResponse<CommentResponse>>> => {
    return commentApi.getReplies(commentId, page, size)
  },

  updateComment: (commentId: string, request: CommentUpdateRequest): Promise<ApiResponse<CommentResponse>> => {
    return commentApi.update(commentId, request)
  },

  deleteComment: (commentId: string): Promise<ApiResponse<void>> => {
    return commentApi.delete(commentId)
  },

  likeComment: (commentId: string): Promise<ApiResponse<void>> => {
    return commentApi.like(commentId)
  },

  unlikeComment: (commentId: string): Promise<ApiResponse<void>> => {
    return commentApi.unlike(commentId)
  },
}
