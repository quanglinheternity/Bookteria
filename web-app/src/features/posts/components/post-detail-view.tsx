"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  MoreHorizontal,
  Lightbulb,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Post, Comment } from "@/lib/mock-data"

function DetailCarousel({
  images,
  postId,
}: {
  images: string[]
  postId: string
}) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
      <Image
        src={images[current] || "/placeholder.svg"}
        alt={`Post ${postId} photo ${current + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 640px"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrent((c) => (c - 1 + images.length) % images.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 p-2 text-card backdrop-blur-sm transition-colors hover:bg-foreground/40"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 p-2 text-card backdrop-blur-sm transition-colors hover:bg-foreground/40"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={`dot-${postId}-${i}`}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === current ? "w-5 bg-card" : "bg-card/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const [liked, setLiked] = useState(comment.isLiked)
  const [likes, setLikes] = useState(comment.likesCount)

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${comment.author.id}`}>
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage
            src={comment.author.avatar || "/placeholder.svg"}
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
          />
          <AvatarFallback>
            {comment.author.firstName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="rounded-lg bg-muted p-3">
          <Link
            href={`/profile/${comment.author.id}`}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            {comment.author.username}
          </Link>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {comment.content}
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-4 px-1 text-xs text-muted-foreground">
          <span>{comment.createdAt}</span>
          <button type="button" className="font-medium hover:text-foreground">
            {likes} likes
          </button>
          <button type="button" className="font-medium hover:text-foreground">
            Reply
          </button>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Link href={`/profile/${reply.author.id}`}>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage
                      src={reply.author.avatar || "/placeholder.svg"}
                      alt={`${reply.author.firstName} ${reply.author.lastName}`}
                    />
                    <AvatarFallback>
                      {reply.author.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted/60 p-3">
                    <Link
                      href={`/profile/${reply.author.id}`}
                      className="text-sm font-semibold text-foreground hover:underline"
                    >
                      {reply.author.username}
                    </Link>
                    <p className="mt-1 text-sm text-foreground">
                      {reply.content}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-4 px-1 text-xs text-muted-foreground">
                    <span>{reply.createdAt}</span>
                    <span>{reply.likesCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setLiked(!liked)
          setLikes((l) => (liked ? l - 1 : l + 1))
        }}
        className="shrink-0 self-start pt-3"
        aria-label={liked ? "Unlike comment" : "Like comment"}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}

export function PostDetailView({
  post,
  comments,
}: {
  post: Post
  comments: Comment[]
}) {
  const router = useRouter()
  const [liked, setLiked] = useState(post.isLiked)
  const [saved, setSaved] = useState(post.isSaved)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [commentText, setCommentText] = useState("")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-6 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-1.5 text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-foreground">Post</h2>
      </header>

      {/* Desktop Two-Column Layout */}
      <div className="mx-auto flex max-w-5xl gap-0 p-6">
        {/* Left: Image */}
        <div className="w-[55%] shrink-0 overflow-hidden rounded-l-xl border border-border">
          <DetailCarousel images={post.images} postId={post.id} />
        </div>

        {/* Right: Content & Comments */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-r-xl border border-l-0 border-border bg-card">
          {/* Author Header */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
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
                href={`/map`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <MapPin className="h-3 w-3" />
                {post.location.name}
              </Link>
            </div>
            <button
              type="button"
              className="text-muted-foreground"
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content + Comments */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Content */}
            <p className="text-sm leading-relaxed text-foreground">
              {post.content}
            </p>
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
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

            {/* Photo Tip */}
            {post.photoTip && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-primary">
                    Photo Tip
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground">
                    {post.photoTip}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between border-y border-border py-3">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setLiked(!liked)
                    setLikesCount((c) => (liked ? c - 1 : c + 1))
                  }}
                  className="group flex items-center gap-1.5"
                  aria-label={liked ? "Unlike" : "Like"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all group-active:scale-125",
                      liked
                        ? "fill-red-500 text-red-500"
                        : "text-foreground"
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {likesCount.toLocaleString()}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 text-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {post.commentsCount}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-foreground"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                aria-label={saved ? "Unsave" : "Save"}
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    saved
                      ? "fill-primary text-primary"
                      : "text-foreground"
                  )}
                />
              </button>
            </div>

            <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
              {post.createdAt}
            </p>

            {/* Comments */}
            <div className="mt-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Comments ({comments.length})
              </h3>
              <div className="space-y-5">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="border-t border-border bg-card px-5 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                  alt="You"
                />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border-none bg-muted text-sm"
              />
              <button
                type="button"
                disabled={!commentText.trim()}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  commentText.trim()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
                aria-label="Send comment"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
