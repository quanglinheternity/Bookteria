"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, Loader2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Conversation } from "@/types/chat.type"
import { UserProfile } from "@/types/user.type"
import { useChatActions } from "@/hooks/chat/useChat"
import { useUserSearch } from "@/hooks/profile/useUserProfileSearch"
import { DEFAULT_AVATAR } from "@/constants/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface ConversationListProps {
  conversations: Conversation[]
  isLoading: boolean
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  onRefresh?: () => void
  currentUserId?: string
}

export function ConversationList({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  onRefresh,
  currentUserId
}: ConversationListProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  } = useUserSearch()

  const { createConversation, isSending } = useChatActions()

  const handleCreateChat = async (userId: string) => {
    const result = await createConversation({
      type: "PRIVATE",
      participantIds: [userId]
    })

    if (result) {
      if (onRefresh) await onRefresh()
      onSelectConversation(result.id)
      clearSearch() // Return to conversation list
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Đang tải...
      </div>
    )
  }

  return (
    <>
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Tin nhắn</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-none bg-muted/50 pl-10 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {searchQuery ? (
            // Search Results Mode
            <div className="space-y-1">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Kết quả tìm kiếm
              </p>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground italic">
                  Không tìm thấy người dùng nào
                </p>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleCreateChat(user.userId)}
                    disabled={isSending}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-muted/50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || DEFAULT_AVATAR} />
                      <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            // Regular Conversation List Mode
            <>
              {conversations.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Chưa có cuộc hội thoại nào
                </div>
              ) : (
                conversations.map((convo) => {
                  const isActive = selectedConversationId === convo.id

                  // Find the other participant to show
                  const otherParticipant = convo.participants?.find(p => p.userId !== currentUserId)
                    || convo.participants?.[0]

                  const displayName = otherParticipant
                    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                    : "Người dùng"

                  const timeDisplay = convo.lastMessage
                    ? dayjs(convo.lastMessage.createdDate).fromNow(true)
                    : dayjs(convo.updatedDate).fromNow(true)

                  return (
                    <button
                      key={convo.id}
                      onClick={() => onSelectConversation(convo.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all",
                        isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-transparent">
                          <AvatarImage
                            src={otherParticipant?.avatar || DEFAULT_AVATAR}
                            alt={displayName}
                          />
                          <AvatarFallback>
                            {otherParticipant?.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {/* Active Status indicator mockup */}
                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      </div>

                      <div className="flex-1 overflow-hidden text-left">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "truncate text-[15px] font-semibold text-foreground",
                          )}>
                            {displayName}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted-foreground ml-2">
                            {timeDisplay}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className={cn(
                            "truncate text-sm leading-tight text-muted-foreground",
                          )}>
                            {convo.lastMessage?.message || "Bắt đầu cuộc trò chuyện"}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </>
  )
}
