import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import {
  AuthorResponse,
  AuthorPageResponse,
  AuthorDeleteResponse,
} from "../types/author.type"

export const authorApi = {
  create: async (formData: FormData): Promise<AuthorResponse> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.BOOK.AUTHORS}/create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data
  },

  getAll: async (page = 1, size = 10, keyword?: string): Promise<AuthorPageResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOK.AUTHORS}/get-all`,
      {
        params: { page, size, keyword },
      }
    )
    return response.data
  },

  getById: async (id: number): Promise<AuthorResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOK.AUTHORS}/${id}/detail`
    )
    return response.data
  },

  update: async (id: number, formData: FormData): Promise<AuthorResponse> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.BOOK.AUTHORS}/${id}/update`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data
  },

  delete: async (id: number): Promise<AuthorDeleteResponse> => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.BOOK.AUTHORS}/${id}/delete`
    )
    return response.data
  },
}
