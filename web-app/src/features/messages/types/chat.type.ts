import { UserProfile } from "./user.type"

export interface Message {
  id: string
  conversationId: string
  senderId?: string
  message: string
  createdAt?: string
  createdDate: string
  me: boolean
  sender?: UserProfile
}

export interface Conversation {
  id: string
  name?: string
  type: "PRIVATE" | "GROUP"
  participantIds: string[]
  participants?: UserProfile[]
  lastMessage?: Message
  createdDate: string
  updatedDate: string
}

export interface CreateConversationRequest {
  type: "PRIVATE" | "GROUP"
  participantIds: string[]
}

export interface CreateMessageRequest {
  conversationId: string
  message: string
}

export interface PageResponse<T> {
  currentPage: number
  totalPages: number
  pageSize: number
  totalElements: number
  data: T[]
}

export interface ApiResponse<T> {
  code: number
  result: T
  message?: string
}

export type GetMyConversationsResponse = ApiResponse<Conversation[]>
export type CreateConversationResponse = ApiResponse<Conversation>
export type GetMessagesResponse = ApiResponse<PageResponse<Message>>
export type CreateMessageResponse = ApiResponse<Message>
