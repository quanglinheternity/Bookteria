"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser } from "@/features/profile/hooks/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DEFAULT_AVATAR } from "@/constants/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useComments } from "../hooks/useComments"
import { commentService } from "../services/comment.service"
import { CommentResponse } from "../types/comment.type"
import { Heart, MessageCircle, Send, MoreHorizontal, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  postId: string
  onCommentCountChange?: (updater: (prev: number) => number) => void
}

export function CommentSection({ postId, onCommentCountChange }: CommentSectionProps) {
  const { user: currentUser } = useUser()
  const { 
    comments, 
    isLoading, 
    fetchComments, 
    addComment, 
    likeComment, 
    unlikeComment,
    deleteComment,
    loadMore,
    hasMore
  } = useComments(postId)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestReply, setLatestReply] = useState<{parentId: string, comment: CommentResponse} | null>(null)

  useEffect(() => {
    fetchComments()
  }, [fetchComments])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    const result = await addComment(newComment.trim(), replyingTo?.id)
    if (result) {
      if (replyingTo) {
        setLatestReply({ parentId: replyingTo.id, comment: result })
      }
      onCommentCountChange?.((prev: number) => prev + 1)
      setNewComment("")
      setReplyingTo(null)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="border-t border-border/50 bg-muted/5 animate-in slide-in-from-top-1 duration-300">
      {/* Replying indicator */}
      {replyingTo && (
        <div className="px-4 py-1.5 bg-primary/5 flex items-center justify-between border-b border-primary/10">
          <p className="text-[10px] font-medium text-primary flex items-center gap-1.5">
            Đang phản hồi <span className="font-bold">@{replyingTo.userName}</span>
          </p>
          <button 
            onClick={() => setReplyingTo(null)}
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            Hủy
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 flex gap-3">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={currentUser?.avatar || DEFAULT_AVATAR} />
          <AvatarFallback>{currentUser?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <Input 
            placeholder={replyingTo ? `Phản hồi ${replyingTo.userName}...` : "Viết bình luận..."} 
            value={newComment}
            autoFocus={!!replyingTo}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-8 text-sm bg-background border-border/50 focus-visible:ring-primary/20"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newComment.trim() || isSubmitting}
            className="h-8 px-3"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>

      {/* Comments List */}
      <div className="px-4 pb-4 space-y-4">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-2">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onLike={() => comment.isLiked ? unlikeComment(comment.id) : likeComment(comment.id)}
              onDelete={async () => {
                const success = await deleteComment(comment.id)
                if (success) {
                  onCommentCountChange?.((prev: number) => prev - 1)
                }
              }}
              onReply={(target) => {
                setReplyingTo(target)
              }}
              isOwner={currentUser?.userId === comment.userId}
              likeComment={likeComment}
              unlikeComment={unlikeComment}
              deleteComment={deleteComment}
              currentUser={currentUser}
              latestReply={latestReply}
              onCommentCountChange={onCommentCountChange}
            />
          ))
        )}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadMore}
              className="text-[11px] text-primary font-semibold hover:bg-primary/5"
            >
              Xem thêm bình luận
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: CommentResponse
  onLike: () => void
  onDelete: () => void
  onReply: (comment: CommentResponse) => void
  isOwner: boolean
  isReply?: boolean
  // Add these for recursive functionality
  likeComment: (id: string) => Promise<boolean>
  unlikeComment: (id: string) => Promise<boolean>
  deleteComment: (id: string) => Promise<boolean>
  currentUser: any
  latestReply: {parentId: string, comment: CommentResponse} | null
  onCommentCountChange?: (updater: (prev: number) => number) => void
}

function CommentItem({ 
  comment, 
  onLike, 
  onDelete, 
  onReply, 
  isOwner, 
  isReply,
  likeComment,
  unlikeComment,
  deleteComment,
  currentUser,
  latestReply,
  onCommentCountChange
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false)
  const [likes, setLikes] = useState(comment.likeCount)

  // Sync with prop changes (when backend returns fresh data)
  useEffect(() => {
    setIsLiked(comment.isLiked || false)
    setLikes(comment.likeCount)
  }, [comment.isLiked, comment.likeCount])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
    onLike()
  }

  return (
    <div className={cn(
      "flex gap-3 group animate-in fade-in duration-500",
      isReply && "mt-3"
    )}>
      <Link href={`/profile/${comment.userId}`} className="shrink-0">
        <Avatar className={cn("border border-border shrink-0", isReply ? "h-6 w-6" : "h-8 w-8")}>
          <AvatarImage src={comment.userAvatar || DEFAULT_AVATAR} />
          <AvatarFallback>{comment.userName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="bg-muted px-3 py-2 rounded-2xl inline-block max-w-full">
          <Link href={`/profile/${comment.userId}`}>
            <p className="text-xs font-bold text-foreground mb-0.5 hover:underline cursor-pointer">{comment.userName}</p>
          </Link>
          <p className="text-[13px] text-foreground/90 leading-relaxed break-words">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2">
          <p className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
          </p>
          <button 
            onClick={handleLike}
            className={cn(
              "text-[10px] font-bold hover:underline",
              isLiked ? "text-rose-500" : "text-muted-foreground"
            )}
          >
            {likes > 0 ? `${likes} Thích` : "Thích"}
          </button>
          
          <button 
            onClick={() => onReply(comment)}
            className="text-[10px] font-bold text-muted-foreground hover:underline"
          >
            Phản hồi
          </button>
          
          {isOwner && (
            <button 
              onClick={onDelete}
              className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Render nested replies */}
        <ReplyList 
          commentId={comment.id}
          initialReplies={comment.replies || []}
          replyCount={comment.replyCount}
          onReply={onReply}
          currentUser={currentUser}
          likeComment={likeComment}
          unlikeComment={unlikeComment}
          deleteComment={deleteComment}
          onCommentDelete={() => onCommentCountChange?.((prev: number) => prev - 1)}
          latestReply={latestReply}
        />
      </div>
    </div>
  )
}

interface ReplyListProps {
  commentId: string
  initialReplies: CommentResponse[]
  replyCount: number
  onReply: (comment: CommentResponse) => void
  currentUser: any
  likeComment: (id: string) => Promise<boolean>
  unlikeComment: (id: string) => Promise<boolean>
  deleteComment: (id: string) => Promise<boolean>
  latestReply: {parentId: string, comment: CommentResponse} | null
  onCommentCountChange?: (updater: (prev: number) => number) => void
  onCommentDelete?: () => void
}

function ReplyList({ 
  commentId, 
  initialReplies, 
  replyCount,
  onReply, 
  currentUser,
  likeComment,
  unlikeComment,
  deleteComment,
  onCommentDelete,
  latestReply,
  onCommentCountChange
}: ReplyListProps) {
  const [replies, setReplies] = useState<CommentResponse[]>(initialReplies)
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    hasMore: false
  })
  const [showReplies, setShowReplies] = useState(false)
  
  // Listen for new replies added globally
  useEffect(() => {
    if (latestReply && latestReply.parentId === commentId) {
      setReplies(prev => {
        // Prevent duplicate if already added
        if (prev.some(r => r.id === latestReply.comment.id)) return prev;
        return [latestReply.comment, ...prev];
      });
      setShowReplies(true);
    }
  }, [latestReply, commentId]);

  const fetchReplies = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await commentService.getReplies(commentId, page, 5)
      if (response.code === 1000) {
        const { data, currentPage, totalPages } = response.result
        setReplies(prev => page === 1 ? data : [...prev, ...data])
        setPagination({
          currentPage,
          totalPages,
          hasMore: currentPage < totalPages
        })
      }
    } catch (error) {
      console.error("Fetch replies error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies(1)
    }
    setShowReplies(!showReplies)
  }

  return (
    <div className="mt-2">
      {/* Toggle Button */}
      <button 
        onClick={handleToggleReplies}
        className="text-[10px] font-bold text-muted-foreground hover:underline flex items-center gap-1.5 ml-2"
      >
        <span className="w-4 h-[1px] bg-muted-foreground/30" />
        {showReplies ? "Ẩn phản hồi" : replyCount > 0 ? `Xem ${replyCount} phản hồi` : "Xem phản hồi"}
      </button>

      {showReplies && (
        <div className="ml-6 border-l-2 border-border/30 pl-4 mt-3 space-y-3">
          {replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onLike={() => reply.isLiked ? unlikeComment(reply.id) : likeComment(reply.id)} 
              onDelete={async () => {
                const success = await deleteComment(reply.id)
                if (success) {
                   setReplies(prev => prev.filter(r => r.id !== reply.id))
                   onCommentDelete?.()
                }
              }}
              onReply={onReply} 
              isOwner={currentUser?.userId === reply.userId}
              isReply={true}
              likeComment={likeComment}
              unlikeComment={unlikeComment}
              deleteComment={deleteComment}
              currentUser={currentUser}
              latestReply={latestReply}
              onCommentCountChange={onCommentCountChange}
            />
          ))}
          
          {pagination.hasMore && (
            <button 
              onClick={() => fetchReplies(pagination.currentPage + 1)}
              disabled={isLoading}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1.5 pt-1"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Xem thêm phản hồi..."
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
