import { ApiResponse, PageResponse } from "@/features/messages"

export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface Author {
  id: number
  name: string
  bio?: string
  birthDate?: string
  nationality?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Book {
  id: number
  isbn: string
  title: string
  subtitle?: string
  description?: string
  publisher?: string
  publishedYear?: number
  pageCount?: number
  language: string
  coverImageUrl?: string
  bookFileUrl?: string
  averageRating: number
  totalReviews: number
  totalReads: number
  createdBy: string
  createdAt: string
  updatedAt: string
  category?: Category
  authors?: Author[]
}

export interface BookCreationRequest {
  isbn?: string
  title: string
  subtitle?: string
  description?: string
  publisher?: string
  publishedYear?: number
  pageCount?: number
  language?: string
  categoryId?: number
  authorIds?: number[]
  coverImage?: File
  bookFile?: File
}

export interface BookUpdateRequest extends Partial<BookCreationRequest> { }

export interface BookSearchRequest {
  keyword?: string
  categoryId?: number
  authorId?: number
  minYear?: number
  maxYear?: number
  language?: string
  page?: number
  size?: number
}

export type GetBookResponse = ApiResponse<Book>
export type SearchBookResponse = ApiResponse<PageResponse<Book>>
export type CreateBookResponse = ApiResponse<Book>
export type UpdateBookResponse = ApiResponse<Book>
export type DeleteBookResponse = ApiResponse<void>
