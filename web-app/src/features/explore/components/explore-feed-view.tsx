"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, TrendingUp, MapPin, Camera, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getAllUsers, CHECKINS } from "@/lib/mock-data"
import { CreatePostBox, PostCard, usePosts } from "@/features/posts"

const TRENDING_TAGS = [
  { tag: "bookstore", count: "2.4k posts" },
  { tag: "hanoi_reads", count: "8.1k posts" },
  { tag: "literature", count: "12k posts" },
  { tag: "morning_coffee", count: "5.6k posts" },
  { tag: "vintage_books", count: "3.2k posts" },
]

export function ExploreFeedView() {
  const [query, setQuery] = useState("")
  const { posts, isLoading, refresh } = usePosts()
  const users = getAllUsers()

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground font-serif">Khám phá</h2>
          </div>
          <div className="relative flex-1 max-w-md ml-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sách, tác giả, bài viết..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 bg-muted/50 border-none pl-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar: Recent Check-ins & Trending (Hidden on tablet/mobile) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sticky top-24">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Lượt check-in</h3>
              </div>
              <div className="space-y-4">
                {CHECKINS.slice(0, 3).map((checkin) => (
                  <div key={checkin.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={checkin.photo || "/placeholder.svg"} alt="Loc" fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-bold text-foreground">{checkin.location.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{checkin.user.firstName} {checkin.user.lastName}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Xu hướng</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((item) => (
                  <Badge key={item.tag} variant="secondary" className="cursor-pointer bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors text-[10px] py-1">
                    #{item.tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            <CreatePostBox onSuccess={refresh} />

            <div className="space-y-6">
              {isLoading && posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">Đang tải dòng thời gian...</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={refresh} />
                ))
              )}

              {!isLoading && posts.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-foreground">Chưa có bài viết nào</h4>
                  <p className="text-sm text-muted-foreground mt-1">Hãy là người đầu tiên chia sẻ cảm nhận về sách hôm nay!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Suggestions */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sticky top-24">
              <div className="mb-4 flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Tác giả & Bạn đọc</h3>
              </div>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-bold text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-muted-foreground">{user.followersCount.toLocaleString()} followers</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] px-3 rounded-full">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

