import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import {
  CategoryRequest,
  CategoryResponse,
  CategoryPageResponse,
  CategoryDeleteResponse,
} from "../types/category.type"

export const categoryApi = {
  create: async (data: CategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.BOOK.CATEGORIES}/create`,
      data
    )
    return response.data
  },

  getAll: async (page = 1, size = 10, keyword?: string): Promise<CategoryPageResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOK.CATEGORIES}/get-all`,
      {
        params: { page, size, keyword },
      }
    )
    return response.data
  },

  getById: async (id: number): Promise<CategoryResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOK.CATEGORIES}/${id}/detail`
    )
    return response.data
  },

  update: async (id: number, data: CategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.BOOK.CATEGORIES}/${id}/update`,
      data
    )
    return response.data
  },

  delete: async (id: number): Promise<CategoryDeleteResponse> => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.BOOK.CATEGORIES}/${id}/delete`
    )
    return response.data
  },
}
