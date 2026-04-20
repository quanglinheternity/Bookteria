"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Sun, Clock } from "lucide-react"
import { getLocationById, getPostsByLocation, CURRENT_USER } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/features/posts/components/post-card"
import { LocationPostForm } from "@/features/posts/components/location-post-form"

interface LocationDetailViewProps {
  id: string
}

export function LocationDetailView({ id }: LocationDetailViewProps) {
  const location = getLocationById(id)
  const posts = location ? getPostsByLocation(location.id, false) : []
  const [showPostForm, setShowPostForm] = useState(false)

  if (!location) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Địa điểm không tìm thấy</h1>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">
            Quay lại
          </Link>
        </div>
      </div>
    )
  }

  const previewImage = posts[0]?.images[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </div>
      </div>

      {/* Cover Image & Location Info */}
      <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={location.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MapPin className="h-24 w-24 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Location Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-4xl font-bold text-white">{location.name}</h1>
          <p className="mt-1 text-white/90">{location.address}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Location Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Tỉnh/Thành phố</span>
            </div>
            <p className="mt-2 font-semibold text-foreground">{location.province}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="w-fit">{location.category}</Badge>
            </div>
            <p className="mt-2 font-semibold text-foreground">Danh mục</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sun className="h-4 w-4" />
              <span className="text-sm">Giờ vàng</span>
            </div>
            <p className="mt-2 font-semibold text-foreground">6h30 chiều</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Bài viết</span>
            </div>
            <p className="mt-2 font-semibold text-foreground">{posts.length}</p>
          </div>
        </div>

        {/* Post Form */}
        {!showPostForm && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={CURRENT_USER.avatar} />
                <AvatarFallback>{CURRENT_USER.firstName[0]}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowPostForm(true)}
                className="flex-1 rounded-full border border-border bg-muted px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Bạn đang ở {location.name}? Có cảnh báo hay mẹo gì không?
              </button>
            </div>
          </div>
        )}

        {showPostForm && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <LocationPostForm
              locationId={location.id}
              locationName={location.name}
              onClose={() => setShowPostForm(false)}
            />
          </div>
        )}

        {/* Posts Feed */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Bài viết tại {location.name}</h2>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold text-foreground">Chưa có bài viết nào</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hãy là người đầu tiên chia sẻ tại địa điểm này
                </p>
                <Button
                  onClick={() => setShowPostForm(true)}
                  className="mt-4"
                >
                  Đăng bài viết
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
