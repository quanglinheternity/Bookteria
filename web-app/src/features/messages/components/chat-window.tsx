"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Phone,
  Video,
  Info,
  PlusCircle,
  Image as ImageIcon,
  Sticker,
  Send,
  ChevronLeft,
  ThumbsUp,
  Camera,
  Loader2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Conversation } from "../types/chat.type"
import { useChatWindow } from "../hooks/useChatWindow"
import { DEFAULT_AVATAR } from "@/constants/image"
import dayjs from "dayjs"

interface ChatWindowProps {
  conversation: Conversation
  onBack: () => void
  currentUserId?: string
}

export function ChatWindow({ conversation, onBack, currentUserId }: ChatWindowProps) {
  const {
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
  } = useChatWindow(conversation, currentUserId)

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Chat Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </Button>
            <Link 
              href={`/profile/${otherParticipant?.userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant?.avatar || DEFAULT_AVATAR} alt={displayName} />
                <AvatarFallback>{otherParticipant?.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-bold leading-none text-foreground">
                  {displayName}
                </span>
                <span className="mt-1 text-[11px] font-medium text-green-500">
                  Đang hoạt động
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Message Area */}
        <ScrollArea 
          className="flex-1 px-4 py-6" 
          viewportRef={scrollRef}
          onScroll={handleScroll}
        >
          <div className="flex flex-col gap-4">
            {isLoading && !isLoadingMore ? (
              <div className="flex justify-center py-10 text-muted-foreground text-sm italic">
                Đang tải tin nhắn...
              </div>
            ) : (
              <>
                {/* Pagination Loader */}
                {isLoadingMore && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}

                {/* Profile header in thread - Only on first page */}
                {!hasMore && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={otherParticipant?.avatar || DEFAULT_AVATAR} alt={displayName} />
                      <AvatarFallback>{otherParticipant?.firstName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <h4 className="text-xl font-bold text-foreground">{displayName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{otherParticipant?.bio || "Không có tiểu sử"}</p>
                  </div>
                )}

                {messages.map((message, i) => {
                  const isMe = message.me
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-full gap-2 mb-2",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMe && (
                        <Avatar className="h-8 w-8 shrink-0 mt-auto">
                          <AvatarImage src={message.sender?.avatar || DEFAULT_AVATAR} />
                          <AvatarFallback>{message.sender?.firstName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={cn(
                          "flex max-w-[75%] flex-col",
                          isMe ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "group relative rounded-2xl px-4 py-2.5 text-sm transition-all",
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          )}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{message.message}</p>
                          <span className={cn(
                            "absolute -bottom-5 whitespace-nowrap text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
                            isMe ? "right-0" : "left-0"
                          )}>
                            {dayjs(message.createdDate).format("HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <footer className="shrink-0 border-t border-border bg-card/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Hành động khác</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0">
                <ImageIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative flex-1">
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isSending}
                className="h-9 border-none bg-muted rounded-full px-4 text-[15px] focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              className={cn(
                "h-9 w-9 text-primary shrink-0 transition-all",
                inputValue.trim() ? "scale-100 opacity-100" : "scale-0 opacity-0 w-0 overflow-hidden"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>

            {!inputValue.trim() && (
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0">
                <ThumbsUp className="h-5 w-5" />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
