import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import {
  GetMyConversationsResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesResponse,
} from "../types/chat.type"

export const chatApi = {
  getMyConversations: async (): Promise<GetMyConversationsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CHAT.MY_CONVERSATIONS)
    return response.data
  },

  createConversation: async (
    data: CreateConversationRequest
  ): Promise<CreateConversationResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CHAT.CREATE_CONVERSATION,
      data
    )
    return response.data
  },

  createMessage: async (
    data: CreateMessageRequest
  ): Promise<CreateMessageResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CHAT.CREATE_MESSAGE,
      data
    )
    return response.data
  },

  getMessages: async (
    conversationId: string,
    page: number = 1,
    size: number = 20
  ): Promise<GetMessagesResponse> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.CHAT.GET_CONVERSATION_MESSAGES}?conversationId=${conversationId}&page=${page}&size=${size}`
    )
    return response.data
  },
}
