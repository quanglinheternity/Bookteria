"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Conversation } from "../types/chat.type"
import { useMessages, useChatActions } from "./useChat"

export function useChatWindow(conversation: Conversation, currentUserId?: string) {
  const { 
    messages, 
    setMessages, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    loadMore 
  } = useMessages(conversation.id)
  const { sendMessage, isSending } = useChatActions()
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0)

  // Find the person I'm chatting with for the header
  const otherParticipant = useMemo(() => 
    conversation.participants?.find(p => p.userId !== currentUserId) 
    || conversation.participants?.[0],
  [conversation, currentUserId])

  const displayName = otherParticipant 
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : "Người dùng"

  useEffect(() => {
    // Scroll to bottom only if it's a NEW message or initial load
    if (scrollRef.current && !isLoadingMore) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
    
    // If we just finished loading more, restore scroll position
    if (scrollRef.current && previousScrollHeight > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight
      const heightDifference = newScrollHeight - previousScrollHeight
      scrollRef.current.scrollTop = heightDifference
      setPreviousScrollHeight(0)
    }
  }, [messages, isLoadingMore, previousScrollHeight])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollTop <= 10 && hasMore && !isLoadingMore) {
      setPreviousScrollHeight(target.scrollHeight)
      loadMore()
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return
    
    const result = await sendMessage({
      conversationId: conversation.id,
      message: inputValue
    })

    if (result) {
      setMessages(prev => [...prev, result])
      setInputValue("")
    }
  }

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    inputValue,
    setInputValue,
    scrollRef,
    otherParticipant,
    displayName,
    isSending,
    handleScroll,
    handleSend
  }
}
