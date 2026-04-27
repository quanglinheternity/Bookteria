"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useConversations } from "../hooks/useChat"
import { useUser } from "@/features/profile"
import { socketConfig } from "@/configurations/socket"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"

export function MessagesView() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const { conversations, isLoading, refresh } = useConversations()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(searchParams.get("conversationId"))
  const [showListOnMobile, setShowListOnMobile] = useState(!searchParams.get("conversationId"))

  // Initialize socket on mount
  useEffect(() => {
    socketConfig.connect()
    return () => {
      socketConfig.disconnect()
    }
  }, [])

  // Sync selectedConversationId with query param change
  useEffect(() => {
    const convoId = searchParams.get("conversationId")
    if (convoId) {
      setSelectedConversationId(convoId)
      setShowListOnMobile(false)
    }
  }, [searchParams])

  // Find the selected conversation object
  const selectedConversation = useMemo(() => 
    conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  )

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setShowListOnMobile(false)
  }

  return (
    <div className="flex h-[calc(100vh-0px)] w-full overflow-hidden bg-background">
      {/* Conversation List Sidebar */}
      <div className={`
        ${showListOnMobile ? "flex" : "hidden md:flex"}
        w-full md:w-[320px] lg:w-[360px] flex-col border-r border-border bg-card/50 backdrop-blur-sm
      `}>
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onRefresh={refresh}
          currentUserId={user?.userId}
        />
      </div>

      {/* Chat Window Area */}
      <div className={`
        ${!showListOnMobile ? "flex" : "hidden md:flex"}
        flex-1 flex-col bg-background/50
      `}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setShowListOnMobile(true)}
            currentUserId={user?.userId}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-4xl text-primary">💬</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Tin nhắn của bạn</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Chọn một cuộc hội thoại từ danh sách để bắt đầu trò chuyện với các nhiếp ảnh gia khác.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
