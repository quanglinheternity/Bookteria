import { ApiResponse, PageResponse } from "@/features/messages"

export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CategoryRequest {
  name: string
  description?: string
}

export type CategoryResponse = ApiResponse<Category>
export type CategoryPageResponse = ApiResponse<PageResponse<Category>>
export type CategoryDeleteResponse = ApiResponse<void>
