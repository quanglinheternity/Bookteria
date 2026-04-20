"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  MessageCircle,
  UserPlus,
  MapPin,
  AtSign,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/lib/mock-data"

const NOTIFICATION_ICONS: Record<
  Notification["type"],
  { icon: typeof Heart; className: string }
> = {
  like: { icon: Heart, className: "text-red-500" },
  comment: { icon: MessageCircle, className: "text-primary" },
  follow: { icon: UserPlus, className: "text-accent" },
  checkin: { icon: MapPin, className: "text-accent" },
  mention: { icon: AtSign, className: "text-primary" },
}

function NotificationItem({ notification }: { notification: Notification }) {
  const config = NOTIFICATION_ICONS[notification.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted",
        !notification.isRead && "bg-primary/5"
      )}
    >
      <div className="relative shrink-0">
        <Link href={`/profile/${notification.actor.id}`}>
          <Avatar className="h-11 w-11">
            <AvatarImage
              src={notification.actor.avatar || "/placeholder.svg"}
              alt={`${notification.actor.firstName} ${notification.actor.lastName}`}
            />
            <AvatarFallback>
              {notification.actor.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card ring-2 ring-card",
            config.className
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm text-foreground">
          <Link
            href={`/profile/${notification.actor.id}`}
            className="font-semibold hover:underline"
          >
            {notification.actor.firstName} {notification.actor.lastName}
          </Link>{" "}
          {notification.message}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {notification.createdAt}
        </p>
      </div>

      {notification.postImage && (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={notification.postImage || "/placeholder.svg"}
            alt="Post thumbnail"
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )}

      {notification.type === "follow" && (
        <Button size="sm" className="shrink-0 text-xs">
          Follow
        </Button>
      )}

      {!notification.isRead && (
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  )
}

export function NotificationsView({
  notifications,
}: {
  notifications: Notification[]
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-bold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <div className="flex gap-2 px-6 pb-3">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              filter === "all"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              filter === "unread"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="mx-auto max-w-3xl p-4">
        <div className="space-y-1">
          {filtered.length > 0 ? (
            filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <MessageCircle className="h-12 w-12" strokeWidth={1} />
              <p className="mt-3 text-sm">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
