import { chatApi } from "../api/chat.api"
import {
  CreateConversationRequest,
  CreateMessageRequest,
} from "../types/chat.type"

export const chatService = {
  async getMyConversations() {
    return await chatApi.getMyConversations()
  },

  async createConversation(data: CreateConversationRequest) {
    return await chatApi.createConversation(data)
  },

  async createMessage(data: CreateMessageRequest) {
    return await chatApi.createMessage(data)
  },

  async getMessages(conversationId: string, page: number = 1, size: number = 20) {
    return await chatApi.getMessages(conversationId, page, size)
  },
}
