"use client"

import { useState, useRef, useEffect } from "react"
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
  Camera
} from "lucide-react"
import { User, CURRENT_USER } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Message } from "./messages-view"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
  user: User
  messages: Message[]
  onBack: () => void
}

export function ChatWindow({ user, messages: initialMessages, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "u_me",
      content: inputValue,
      createdAt: "Just now",
      type: "text",
    }
    setMessages([...messages, newMessage])
    setInputValue("")
  }

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
            <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold leading-none text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="mt-1 text-[11px] font-medium text-green-500">
                Active now
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Phone className="h-5 w-5 fill-current opacity-20" />
              <Phone className="h-5 w-5 absolute" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Video className="h-5 w-5 fill-current opacity-20" />
              <Video className="h-5 w-5 absolute" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
              <Info className="h-5 w-5 fill-current opacity-20" />
              <Info className="h-5 w-5 absolute" />
            </Button>
          </div>
        </header>

        {/* Message Area */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Centered User Info for top of thread */}
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h4 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h4>
              <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
              <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest font-semibold">
                You are friends on Photo Scout
              </p>
            </div>

            {messages.map((message, i) => {
              const isMe = message.senderId === "u_me"
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex max-w-[75%] items-end gap-2",
                    isMe ? "ml-auto" : ""
                  )}
                >
                  {!isMe && (
                    <Avatar className="h-10 w-10 mb-0.5 rounded-full sr-only">
                      <AvatarImage src={user.avatar} className="rounded-full" />
                      <AvatarFallback className="rounded-full">{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "group relative rounded-2xl px-4 py-2.5 text-sm transition-all",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <span className={cn(
                      "absolute -bottom-5 whitespace-nowrap text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
                      isMe ? "right-0" : "left-0"
                    )}>
                      {message.createdAt}
                    </span>
                  </div>
                </div>
              )
            })}
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
                <TooltipContent>More actions</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0 hidden sm:flex">
                <Camera className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0 hidden sm:flex">
                <Sticker className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative flex-1">
              <Input
                placeholder="Aa"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-9 border-none bg-muted rounded-full px-4 text-[15px] focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSend}
              className={cn(
                "h-9 w-9 text-primary shrink-0 transition-transform",
                inputValue.trim() ? "scale-100" : "scale-0 w-0 overflow-hidden"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>

            {!inputValue.trim() && (
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary shrink-0">
                <ThumbsUp className="h-5 w-5 fill-current opacity-20" />
                <ThumbsUp className="h-5 w-5 absolute" />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
