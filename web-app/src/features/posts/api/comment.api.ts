import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import { ApiResponse, PageResponse } from "@/features/messages"
import { 
  CommentResponse, 
  CommentCreationRequest, 
  CommentUpdateRequest 
} from "../types/comment.type"

export const commentApi = {
  create: async (data: CommentCreationRequest): Promise<ApiResponse<CommentResponse>> => {
    const response = await axiosInstance.post(API_ENDPOINTS.POST.COMMENTS + "/", data)
    return response.data
  },

  getByPostId: async (postId: string, page = 1, size = 10): Promise<ApiResponse<PageResponse<CommentResponse>>> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.POST.COMMENTS}/post/${postId}`, {
      params: { page, size }
    })
    return response.data
  },

  getReplies: async (commentId: string, page = 1, size = 10): Promise<ApiResponse<PageResponse<CommentResponse>>> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.POST.COMMENTS}/${commentId}/replies`, {
      params: { page, size }
    })
    return response.data
  },

  update: async (commentId: string, data: CommentUpdateRequest): Promise<ApiResponse<CommentResponse>> => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.POST.COMMENTS}/${commentId}`, data)
    return response.data
  },

  delete: async (commentId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.POST.COMMENTS}/${commentId}`)
    return response.data
  },

  like: async (commentId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.POST.COMMENTS}/${commentId}/like`)
    return response.data
  },

  unlike: async (commentId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.POST.COMMENTS}/${commentId}/unlike`)
    return response.data
  },
}
