import { ApiResponse, PageResponse } from "@/features/messages"

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

export interface AuthorCreationRequest {
  name: string
  bio?: string
  birthDate?: string
  nationality?: string
  avatar?: File
}

export interface AuthorUpdateRequest extends Partial<AuthorCreationRequest> {}

export type AuthorResponse = ApiResponse<Author>
export type AuthorPageResponse = ApiResponse<PageResponse<Author>>
export type AuthorDeleteResponse = ApiResponse<void>
