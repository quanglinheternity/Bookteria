"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, TrendingUp, MapPin, Camera, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { POSTS, getAllUsers, CHECKINS } from "@/lib/mock-data"

const TRENDING_TAGS = [
  { tag: "golden_hour", count: "2.4k posts" },
  { tag: "hanoi", count: "8.1k posts" },
  { tag: "landscape", count: "12k posts" },
  { tag: "street_photography", count: "5.6k posts" },
  { tag: "hoian", count: "3.2k posts" },
  { tag: "sapa", count: "4.8k posts" },
]

export function ExploreFeedView() {
  const [query, setQuery] = useState("")
  const users = getAllUsers()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center gap-4 px-6 py-3">
          <h2 className="text-lg font-bold text-foreground">Explore</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search locations, photographers, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 bg-muted pl-10 text-sm"
            />
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Top Row: Check-ins + Trending + Suggested */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          {/* Recent Check-ins */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">
                Recent Check-ins
              </h3>
            </div>
            <div className="space-y-3">
              {CHECKINS.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={checkin.photo || "/placeholder.svg"}
                      alt={checkin.location.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {checkin.location.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={checkin.user.avatar || "/placeholder.svg"}
                          alt={`${checkin.user.firstName} ${checkin.user.lastName}`}
                        />
                        <AvatarFallback className="text-[8px]">
                          {checkin.user.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {checkin.user.firstName} {checkin.user.lastName} - {checkin.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Trending Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((item) => (
                <Badge
                  key={item.tag}
                  variant="secondary"
                  className="cursor-pointer px-3 py-2 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  #{item.tag}
                  <span className="ml-1.5 text-muted-foreground">
                    {item.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Suggested Photographers */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Photographers to Follow
              </h3>
            </div>
            <div className="space-y-3">
              {users.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3"
                >
                  <Link href={`/profile/${user.id}`}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>
                        {user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 overflow-hidden">
                    <Link
                      href={`/profile/${user.id}`}
                      className="block truncate text-sm font-semibold text-foreground hover:underline"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
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
        </div>

        {/* Explore Photo Grid */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Discover Photos
          </h3>
          <div className="grid grid-cols-4 gap-2 xl:grid-cols-5">
            {POSTS.flatMap((post) =>
              post.images.map((img, i) => (
                <Link
                  key={`${post.id}-${i}`}
                  href={`/post/${post.id}`}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt="Explore photo"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 1024px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-card">
                      <Heart className="h-4 w-4 fill-current" />
                      {post.likesCount.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
