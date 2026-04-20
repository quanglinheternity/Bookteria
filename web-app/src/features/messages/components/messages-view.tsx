"use client"

import { useState } from "react"
import { getAllUsers, CURRENT_USER } from "@/lib/mock-data"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"

// Mock message type
export interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  type: "text" | "image"
}

// Mock messages data
const MOCK_MESSAGES: Record<string, Message[]> = {
  u1: [
    { id: "m1", senderId: "u1", content: "Hey Anh! That golden hour shot you posted was amazing!", createdAt: "10:30 AM", type: "text" },
    { id: "m2", senderId: "u_me", content: "Thanks Minh! I really appreciate it. The light was just perfect that day.", createdAt: "10:32 AM", type: "text" },
    { id: "m3", senderId: "u1", content: "Which lens were you using for that one?", createdAt: "10:33 AM", type: "text" },
  ],
  u2: [
    { id: "m4", senderId: "u2", content: "Are you going to Sa Pa next week for the harvest season?", createdAt: "Yesterday", type: "text" },
    { id: "m5", senderId: "u_me", content: "Thinking about it! The weather looks promising.", createdAt: "Yesterday", type: "text" },
  ],
  u3: [
    { id: "m6", senderId: "u3", content: "Thanks for the tip about the polarizing filter! It really made a difference at the lake.", createdAt: "2 days ago", type: "text" },
  ]
}

const CONVERSATIONS = [
  {
    userId: "u1",
    lastMessage: "Which lens were you using for that one?",
    time: "2m ago",
    unread: true,
  },
  {
    userId: "u2",
    lastMessage: "Are you going to Sa Pa next week?",
    time: "1h ago",
    unread: true,
  },
  {
    userId: "u3",
    lastMessage: "Thanks for the tip about the lens!",
    time: "3h ago",
    unread: false,
  },
  {
    userId: "u4",
    lastMessage: "Let's do a photo walk in Saigon",
    time: "1d ago",
    unread: false,
  },
]

export function MessagesView() {
  const users = getAllUsers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(CONVERSATIONS[0].userId)
  const [showListOnMobile, setShowListOnMobile] = useState(true)

  const selectedUser = users.find((u) => u.id === selectedUserId)
  const messages = selectedUserId ? MOCK_MESSAGES[selectedUserId] || [] : []

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id)
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
          conversations={CONVERSATIONS}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Chat Window Area */}
      <div className={`
        ${!showListOnMobile ? "flex" : "hidden md:flex"}
        flex-1 flex-col bg-background/50
      `}>
        {selectedUser ? (
          <ChatWindow
            user={selectedUser}
            messages={messages}
            onBack={() => setShowListOnMobile(true)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-4xl text-primary">💬</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">Your Messages</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Select a conversation from the list to start chatting with other photographers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
