"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  MoreHorizontal,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/lib/mock-data"

interface PostCardProps {
  post: Post
}

function ImageCarousel({
  images,
  postId,
}: {
  images: string[]
  postId: string
}) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length)
  }, [images.length])

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
      <Image
        src={images[current] || "/placeholder.svg"}
        alt={`Post ${postId} photo ${current + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 640px"
        priority={current === 0}
        loading="eager"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 p-2 text-card backdrop-blur-sm transition-colors hover:bg-foreground/40"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 p-2 text-card backdrop-blur-sm transition-colors hover:bg-foreground/40"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={`dot-${postId}-${i}`}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  i === current ? "w-4 bg-card" : "bg-card/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [saved, setSaved] = useState(post.isSaved)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showTip, setShowTip] = useState(false)

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      setLikesCount((c) => (prev ? c - 1 : c + 1))
      return !prev
    })
  }, [])

  const toggleSave = useCallback(() => {
    setSaved((prev) => !prev)
  }, [])

  return (
    <article className="border-b border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link href={`/profile/${post.author.id}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={`${post.author.firstName} ${post.author.lastName}`}
            />
            <AvatarFallback>
              {post.author.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link
            href={`/profile/${post.author.id}`}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            {post.author.firstName} {post.author.lastName}
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <MapPin className="h-3 w-3" />
            {post.location.name}
          </Link>
        </div>
        <button
          type="button"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <ImageCarousel images={post.images} postId={post.id} />

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={toggleLike}
            className="group flex items-center gap-1.5 transition-colors"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-all group-active:scale-125",
                liked ? "fill-red-500 text-red-500" : "text-foreground"
              )}
            />
            <span className="text-sm font-medium text-foreground">
              {likesCount.toLocaleString()}
            </span>
          </button>
          <Link
            href={`/post/${post.id}`}
            className="group flex items-center gap-1.5 text-foreground transition-colors"
          >
            <MessageCircle className="h-6 w-6 group-hover:text-primary" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </Link>
          <button
            type="button"
            className="text-foreground transition-colors hover:text-primary"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {post.photoTip && (
            <button
              type="button"
              onClick={() => setShowTip((s) => !s)}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                showTip
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              aria-label="Photo tip"
            >
              <Lightbulb className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleSave}
            className="transition-colors"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark
              className={cn(
                "h-6 w-6 transition-all",
                saved ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </button>
        </div>
      </div>

      {/* Photo Tip */}
      {showTip && post.photoTip && (
        <div className="mx-5 mb-3 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-foreground">
            {post.photoTip}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-foreground">
          <Link
            href={`/profile/${post.author.id}`}
            className="mr-1 font-semibold hover:underline"
          >
            {post.author.username}
          </Link>
          {post.content}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal text-muted-foreground"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {post.commentsCount > 0 && (
          <Link
            href={`/post/${post.id}`}
            className="mt-2 block text-sm text-muted-foreground hover:text-foreground"
          >
            View all {post.commentsCount} comments
          </Link>
        )}
        <p className="mt-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
          {post.createdAt}
        </p>
      </div>
    </article>
  )
}
