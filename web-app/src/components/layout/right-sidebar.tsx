"use client"

import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  MapPin,
  Camera,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllUsers, CHECKINS, CURRENT_USER } from "@/lib/mock-data"

const TRENDING_TAGS = [
  { tag: "golden_hour", count: "2.4k" },
  { tag: "hanoi", count: "8.1k" },
  { tag: "landscape", count: "12k" },
  { tag: "street_photography", count: "5.6k" },
  { tag: "hoian", count: "3.2k" },
]

export function RightSidebar() {
  const users = getAllUsers()

  return (
    <aside className="hidden w-[320px] shrink-0 xl:block">
      <div className="sticky top-0 h-screen overflow-y-auto p-6 hide-scrollbar">
        {/* Current User */}
        <div className="mb-6 flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <AvatarImage src={CURRENT_USER.avatar || "/placeholder.svg"} alt={`${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`} />
            <AvatarFallback>{CURRENT_USER.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{CURRENT_USER.firstName} {CURRENT_USER.lastName}</p>
            <p className="text-xs text-muted-foreground">@{CURRENT_USER.username}</p>
          </div>
        </div>

        {/* Suggested Photographers */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Camera className="h-3.5 w-3.5" />
              Suggested for you
            </h3>
            <Link href="/explore" className="text-xs font-medium text-primary hover:underline">
              See All
            </Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Link href={`/profile/${user.id}`}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 overflow-hidden">
                  <Link
                    href={`/profile/${user.id}`}
                    className="block truncate text-sm font-semibold text-foreground hover:underline"
                  >
                    {user.firstName} {user.lastName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.followersCount.toLocaleString()} followers
                  </p>
                </div>
                <Button
                  variant={user.isFollowing ? "outline" : "default"}
                  size="sm"
                  className={`shrink-0 text-xs ${user.isFollowing ? "bg-transparent" : ""}`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Trending Tags
          </h3>
          <div className="space-y-2">
            {TRENDING_TAGS.map((item) => (
              <Link
                key={item.tag}
                href={`/explore?tag=${item.tag}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">#{item.tag}</span>
                <span className="text-xs text-muted-foreground">{item.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Recent Check-ins
          </h3>
          <div className="space-y-3">
            {CHECKINS.map((checkin) => (
              <div
                key={checkin.id}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={checkin.photo || "/placeholder.svg"}
                    alt={checkin.location.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {checkin.user.firstName} {checkin.user.lastName}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {checkin.location.name} - {checkin.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-[11px] leading-relaxed text-muted-foreground">
          <p>Vietnam Photo Scout - VPS</p>
          <p className="mt-1">Discover and share photo spots across Vietnam</p>
        </div>
      </div>
    </aside>
  )
}
