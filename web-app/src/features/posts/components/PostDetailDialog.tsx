"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DEFAULT_AVATAR } from "@/constants/image"
import { PostResponse } from "../types/post.type"
import { CommentSection } from "./CommentSection"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PostDetailDialogProps {
  post: PostResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onCommentCountChange?: (updater: (prev: number) => number) => void
}

export function PostDetailDialog({
  post,
  open,
  onOpenChange,
  onCommentCountChange
}: PostDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] h-[90vh] flex flex-col md:flex-row p-0 gap-0 overflow-hidden border-none bg-card shadow-2xl">
        {/* Left Side: Images */}
        <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative group">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <>
              <img 
                src={post.imageUrls[currentImageIndex]} 
                className="max-h-full max-w-full object-contain" 
                alt="Post content" 
              />
              {post.imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : post.imageUrls.length - 1)}
                    className="absolute left-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev < post.imageUrls.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 flex gap-1.5">
                    {post.imageUrls.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          i === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                        )} 
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-white/20 italic">Không có hình ảnh</div>
          )}
        </div>

        {/* Right Side: Header + Content & Comments (with sticky input) */}
        <div className="flex-1 flex flex-col min-w-0 bg-card border-l border-border h-full">
          {/* Author Header */}
          <div className="p-4 border-b border-border shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user.userId}`}>
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={post.user.avatar || DEFAULT_AVATAR} />
                  <AvatarFallback>{post.user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <DialogTitle className="text-sm font-bold hover:underline">
                  <Link href={`/profile/${post.user.userId}`}>
                    {post.user.firstName} {post.user.lastName}
                  </Link>
                </DialogTitle>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">{post.created}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <CommentSection 
              postId={post.id} 
              onCommentCountChange={onCommentCountChange}
              header={
                <div className="p-4 border-b border-border/50">
                  <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
