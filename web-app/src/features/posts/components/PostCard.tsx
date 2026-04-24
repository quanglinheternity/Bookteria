"use client"
import NextImage from "next/image"
import Link from "next/link"

import { useState, useEffect } from "react"
import { useUser } from "@/features/profile/hooks/useUser"
import { DEFAULT_AVATAR } from "@/constants/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MoreHorizontal, X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react"
import { PostResponse, Visibility } from "../types/post.type"
import { usePostActions } from "../hooks/usePostActions"
import { CommentSection } from "./CommentSection"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PostCardProps {
  post: PostResponse
  onDelete?: () => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user: currentUser } = useUser()
  const isOwner = currentUser?.userId === post.user.userId

  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post.likeCount)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHideConfirm, setShowHideConfirm] = useState(false)
  const { likePost, unlikePost, updatePost, deletePost } = usePostActions()

  useEffect(() => {
    setIsLiked(post.isLiked || false)
    setLikesCount(post.likeCount)
  }, [post.isLiked, post.likeCount])

  const [showComments, setShowComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.commentCount)

  const handleLike = async () => {
    if (isActionLoading) return

    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic UI
    setIsLiked(!previousLiked)
    setLikesCount(prev => previousLiked ? prev - 1 : prev + 1)

    try {
      setIsActionLoading(true)
      const success = previousLiked
        ? await unlikePost(post.id)
        : await likePost(post.id)

      if (!success) {
        setIsLiked(previousLiked)
        setLikesCount(previousCount)
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const confirmDelete = async () => {
    setIsActionLoading(true)
    const success = await deletePost(post.id)
    if (success) {
      onDelete?.()
    }
    setIsActionLoading(false)
    setShowDeleteConfirm(false)
  }

  const confirmHide = async () => {
    setIsActionLoading(true)
    const success = await updatePost(post.id, {
      visibility: Visibility.PRIVATE
    })
    if (success) {
      onDelete?.()
    }
    setIsActionLoading(false)
    setShowHideConfirm(false)
  }

  const renderImages = () => {
    const images = post.imageUrls || []
    if (images.length === 0) return null

    const handleImageGrid = () => {
      const count = images.length
      if (count === 0) return null

      if (count === 1) {
        return (
          <div
            className="relative w-full aspect-[3/2] max-h-[400px] overflow-hidden rounded-xl border border-border/10 bg-muted/20 flex items-center justify-center cursor-zoom-in"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={images[0]}
              className="w-full h-full object-cover rounded-xl transition-all hover:scale-[1.02] duration-500"
              alt="Post content"
            />
          </div>
        )
      }

      if (count === 2) {
        return (
          <div className="grid grid-cols-2 gap-1 px-0.5 aspect-video">
            {images.slice(0, 2).map((url, i) => (
              <img
                key={i}
                src={url}
                className="h-full w-full object-cover rounded-xl border border-border/10 hover:brightness-90 transition-all cursor-zoom-in"
                onClick={() => setSelectedImageIndex(i)}
                alt=""
              />
            ))}
          </div>
        )
      }

      if (count === 3) {
        return (
          <div className="grid grid-cols-2 gap-1 px-0.5 aspect-video">
            <img
              src={images[0]}
              className="row-span-2 h-full w-full object-cover rounded-xl border border-border/10 hover:brightness-90 transition-all cursor-zoom-in"
              onClick={() => setSelectedImageIndex(0)}
              alt=""
            />
            <div className="grid grid-rows-2 gap-1 h-full">
              {images.slice(1, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="h-full w-full object-cover rounded-xl border border-border/10 hover:brightness-90 transition-all cursor-zoom-in"
                  onClick={() => setSelectedImageIndex(i + 1)}
                  alt=""
                />
              ))}
            </div>
          </div>
        )
      }

      // 4 images or more
      return (
        <div className="relative grid grid-cols-2 gap-1 px-0.5 aspect-video">
          {images.slice(0, 4).map((url, i) => (
            <div key={i} className="relative h-full w-full group overflow-hidden rounded-xl cursor-zoom-in" onClick={() => setSelectedImageIndex(i)}>
              <img src={url} className="h-full w-full object-cover rounded-xl border border-border/10 group-hover:scale-105 transition-all duration-500" alt="" />
              {i === 3 && count > 4 && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white text-3xl font-black">+{count - 4}</span>
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">Ảnh khác</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="mt-4 border-y border-border/10 bg-muted/5 group-hover:border-border/30 transition-colors">
        {handleImageGrid()}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Post Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.user.userId}`} className="relative group cursor-pointer">
              <Avatar className="h-10 w-10 border border-border ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                <AvatarImage src={post.user.avatar || DEFAULT_AVATAR} alt={post.user.lastName} />
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-card rounded-full" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/profile/${post.user.userId}`}>
                  <h4 className="text-sm font-bold text-foreground hover:underline cursor-pointer decoration-primary/30">
                    {post.user.firstName} {post.user.lastName}
                  </h4>
                </Link>
                <Badge variant="secondary" className="text-[9px] px-1.5 h-4 font-bold bg-primary/5 text-primary border-primary/10">
                  {post.postType === "REVIEW" ? "Bình duyệt" : "Bài viết"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                <MoreHorizontal className="h-2 w-2 fill-current" /> {post.created}
              </p>
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => setShowHideConfirm(true)}
                >
                  <X className="h-4 w-4" />
                  <span>Ẩn bài viết</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-rose-500 focus:text-rose-500"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa bài viết</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        <div className="px-4 pb-1">
          <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap selection:bg-primary/20">
            {post.content}
          </p>
        </div>

        {/* Image Grid */}
        {renderImages()}

        {/* Stats Summary */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="bg-rose-500 rounded-full p-1 border-2 border-card z-10">
                <Heart className="h-2 w-2 text-white fill-current" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{likesCount} lượt thích</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>{commentsCount} bình luận</span>
            <span className="text-xs text-muted-foreground font-medium hover:underline cursor-pointer">{post.shareCount} chia sẻ</span>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-1 px-2 py-1 bg-muted/5 border-b border-border/10">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-9 gap-2 transition-all rounded-md font-bold text-xs",
              isLiked ? "text-rose-500 hover:bg-rose-50" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current scale-110")} />
            Thích
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-9 gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all rounded-md font-bold text-xs",
              showComments && "text-primary bg-primary/5"
            )}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className={cn("h-4 w-4", showComments && "fill-current")} />
            Bình luận
          </Button>

          <Button variant="ghost" size="sm" className="flex-1 h-9 gap-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all rounded-md font-bold text-xs">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentSection
            postId={post.id}
            onCommentCountChange={setCommentsCount}
          />
        )}
      </div>

      {/* Image Lightbox Overlay */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-md animate-in fade-in duration-300 select-none"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          {post.imageUrls.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-10 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110]"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : post.imageUrls.length - 1)
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                className="absolute right-4 md:right-10 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110]"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(prev => prev !== null && prev < post.imageUrls.length - 1 ? prev + 1 : 0)
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-white text-sm font-medium">
                  {selectedImageIndex + 1} / {post.imageUrls.length}
                </span>
              </div>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
            <img
              src={post.imageUrls[selectedImageIndex]}
              alt="Full view"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      {/* Confirmation Dialogs */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-500 hover:bg-rose-600">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHideConfirm} onOpenChange={setShowHideConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ẩn bài viết này?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài viết sẽ được chuyển sang chế độ "Chỉ mình tôi". Mọi người sẽ không còn thấy bài viết này trên dòng thời gian.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmHide}>
              Xác nhận ẩn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
