"use client"

import { Search, Plus, MoreHorizontal } from "lucide-react"
import { getAllUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: any[]
  selectedUserId: string | null
  onSelectUser: (id: string) => void
}

export function ConversationList({ conversations, selectedUserId, onSelectUser }: ConversationListProps) {
  const users = getAllUsers()

  return (
    <>
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Messages</h2>
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
            placeholder="Search Messenger"
            className="h-10 border-none bg-muted/50 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {conversations.map((convo) => {
            const user = users.find((u) => u.id === convo.userId)
            if (!user) return null

            const isActive = selectedUserId === user.id

            return (
              <button
                key={convo.userId}
                onClick={() => onSelectUser(user.id)}
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
                      src={user.avatar || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                       {user.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {convo.unread && !isActive && (
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                  )}
                  {/* Active Status indicator mockup */}
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>

                <div className="flex-1 overflow-hidden text-left">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "truncate text-[15px] font-semibold",
                      convo.unread && !isActive ? "text-foreground" : ""
                    )}>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground ml-2">
                      {convo.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={cn(
                      "truncate text-sm leading-tight",
                      convo.unread && !isActive ? "font-bold text-foreground" : "text-muted-foreground"
                    )}>
                      {convo.lastMessage}
                    </p>
                    {convo.unread && !isActive && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 ml-1" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </>
  )
}
