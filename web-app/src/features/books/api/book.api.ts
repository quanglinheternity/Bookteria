import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import {
  BookCreationRequest,
  BookUpdateRequest,
  BookSearchRequest,
  GetBookResponse,
  SearchBookResponse,
  CreateBookResponse,
  UpdateBookResponse,
  DeleteBookResponse,
} from "../types/book.type"

export const bookApi = {
  create: async (data: BookCreationRequest): Promise<CreateBookResponse> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "authorIds" && Array.isArray(value)) {
          value.forEach((id) => formData.append("authorIds", id.toString()))
        } else {
          formData.append(key, value instanceof File ? value : value.toString())
        }
      }
    })

    const response = await axiosInstance.post(
      `${API_ENDPOINTS.BOOK.BOOKS}/create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data
  },

  search: async (params: BookSearchRequest): Promise<SearchBookResponse> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BOOK.BOOKS}/search`, {
      params,
    })
    return response.data
  },

  getById: async (id: number): Promise<GetBookResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOK.BOOKS}/${id}/detail`
    )
    return response.data
  },

  update: async (id: number, data: BookUpdateRequest): Promise<UpdateBookResponse> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "authorIds" && Array.isArray(value)) {
          value.forEach((authorId) => formData.append("authorIds", authorId.toString()))
        } else {
          formData.append(key, value instanceof File ? value : value.toString())
        }
      }
    })

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.BOOK.BOOKS}/${id}/update`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data
  },

  delete: async (id: number): Promise<DeleteBookResponse> => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.BOOK.BOOKS}/${id}/delete`
    )
    return response.data
  },
}
