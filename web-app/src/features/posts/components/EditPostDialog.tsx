"use client"

import { useState, useEffect } from "react"
import { X, Image as ImageIcon, Video, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PostResponse } from "../types/post.type"
import { useEditPost } from "../hooks/useEditPost"
import { cn } from "@/lib/utils"

interface EditPostDialogProps {
  post: PostResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditPostDialog({ post, open, onOpenChange, onSuccess }: EditPostDialogProps) {
  const {
    content,
    setContent,
    imageUrls,
    isSubmitting,
    handleUpdate,
    handleFileUpload,
    removeImage
  } = useEditPost(post, onSuccess, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none bg-card">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20">
          <DialogTitle className="text-center font-serif text-xl">Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <Textarea
            placeholder="Bạn đang nghĩ gì thế?"
            className="min-h-[150px] w-full resize-none border-none bg-transparent p-0 text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                <ImageIcon className="h-5 w-5" />
                <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} accept="image/*" />
              </label>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 text-accent">
                <Video className="h-5 w-5" />
              </Button>
            </div>

            <Button
              className="px-8 rounded-full font-bold transition-all shadow-lg shadow-primary/20"
              disabled={isSubmitting || (!content.trim() && imageUrls.length === 0)}
              onClick={handleUpdate}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
