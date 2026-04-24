import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import { ApiResponse, PageResponse } from "@/features/messages"
import { PostResponse, PostCreationRequest, PostUpdateRequest, FileResponse } from "../types/post.type"

export const postApi = {
  create: async (data: PostCreationRequest): Promise<ApiResponse<PostResponse>> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.POST.POSTS}/create`,
      data
    )
    return response.data
  },

  getAll: async (page = 1, size = 10): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.POST.POSTS}/all?page=${page}&size=${size}`
    )
    return response.data
  },

  getMyPosts: async (page = 1, size = 10): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.POST.POSTS}/my-posts?page=${page}&size=${size}`
    )
    return response.data
  },

  getPostsByUserId: async (userId: string, page = 1, size = 10): Promise<ApiResponse<PageResponse<PostResponse>>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.POST.POSTS}/user/${userId}?page=${page}&size=${size}`
    )
    return response.data
  },

  getById: async (postId: string): Promise<ApiResponse<PostResponse>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.POST.POSTS}/${postId}/detail`
    )
    return response.data
  },

  update: async (postId: string, data: PostUpdateRequest): Promise<ApiResponse<PostResponse>> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.POST.POSTS}/${postId}/update`,
      data
    )
    return response.data
  },

  delete: async (postId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.POST.POSTS}/${postId}/delete`
    )
    return response.data
  },

  like: async (postId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.POST.POSTS}/${postId}/like`
    )
    return response.data
  },

  unlike: async (postId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.POST.POSTS}/${postId}/unlike`
    )
    return response.data
  },

  uploadMedia: async (file: File): Promise<ApiResponse<FileResponse>> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.POST.POSTS}/upload-media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  },
}
