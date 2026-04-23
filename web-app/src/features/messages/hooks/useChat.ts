"use client"

import { useState, useEffect, useCallback } from "react"
import { chatService } from "../services/chat.service"
import { socketConfig } from "@/configurations/socket"
import {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateMessageRequest,
} from "../types/chat.type"
import { useToast } from "@/hooks/ui/useToast"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await chatService.getMyConversations()
      if (response.code === 1000) {
        setConversations(response.result)
      } else {
        setError("Không thể tải danh sách cuộc trò chuyện")
        toast.error("Lỗi", "Không thể tải danh sách cuộc trò chuyện")
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchConversations()
    
    // Listen for real-time updates to refresh the list
    const socket = socketConfig.getSocket()
    socket.on("message", (msgStr: string) => {
      // Refresh list to show latest message snippet/sorting
      fetchConversations()
    })

    return () => {
      socket.off("message")
    }
  }, [fetchConversations])

  return { conversations, isLoading, error, refresh: fetchConversations }
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchMessages = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (!conversationId) return
    try {
      if (isLoadMore) setIsLoadingMore(true)
      else setIsLoading(true)

      const response = await chatService.getMessages(conversationId, pageNum)
      if (response.code === 1000) {
        const { data, totalPages: total } = response.result
        
        // Backend returns newest first. For chat UI, we want oldest first.
        const sortedData = [...data].reverse()

        if (isLoadMore) {
          setMessages(prev => [...sortedData, ...prev])
        } else {
          setMessages(sortedData)
        }
        
        setPage(pageNum)
        setTotalPages(total)
      } else {
        setError("Không thể tải tin nhắn")
        toast.error("Lỗi", "Không thể tải tin nhắn")
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ")
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [conversationId, toast])

  const loadMore = useCallback(() => {
    if (page < totalPages && !isLoadingMore && !isLoading) {
      fetchMessages(page + 1, true)
    }
  }, [page, totalPages, isLoadingMore, isLoading, fetchMessages])

  // Initial fetch on conversation switch
  useEffect(() => {
    setMessages([])
    setPage(1)
    setTotalPages(0)
    fetchMessages(1, false)
  }, [conversationId, fetchMessages])

  // Socket listener for new messages
  useEffect(() => {
    if (!conversationId) return

    const socket = socketConfig.getSocket()
    const handleNewMessage = (msgStr: string) => {
      try {
        const newMessage = JSON.parse(msgStr) as Message
        if (newMessage.conversationId === conversationId) {
          setMessages(prev => [...prev, newMessage])
        }
      } catch (err) {
        console.error("Error parsing socket message:", err)
      }
    }

    socket.on("message", handleNewMessage)
    return () => {
      socket.off("message", handleNewMessage)
    }
  }, [conversationId])

  return { 
    messages, 
    setMessages, 
    isLoading, 
    isLoadingMore, 
    hasMore: page < totalPages,
    loadMore,
    error, 
    refresh: () => fetchMessages(1, false) 
  }
}

export function useChatActions() {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const sendMessage = async (data: CreateMessageRequest) => {
    setIsSending(true)
    try {
      const response = await chatService.createMessage(data)
      if (response.code === 1000) {
        return response.result
      } else {
        toast.error("Lỗi", "Không thể gửi tin nhắn")
        return null
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Không thể gửi tin nhắn")
      console.error(err)
      return null
    } finally {
      setIsSending(false)
    }
  }

  const createConversation = async (data: CreateConversationRequest) => {
    setIsSending(true)
    try {
      const response = await chatService.createConversation(data)
      if (response.code === 1000) {
        return response.result
      } else {
        toast.error("Lỗi", "Không thể tạo cuộc trò chuyện")
        return null
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Không thể tạo cuộc trò chuyện")
      console.error(err)
      return null
    } finally {
      setIsSending(false)
    }
  }

  return { sendMessage, createConversation, isSending }
}
