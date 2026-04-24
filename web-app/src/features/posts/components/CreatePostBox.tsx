"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_AVATAR } from "@/constants/image"
import { useUser } from "@/features/profile/hooks/useUser"
import { Image, Video, MapPin, Send, Loader2, X, Plus } from "lucide-react"
import { PostType, Visibility } from "../types/post.type"
import { usePostActions } from "../hooks/usePostActions"
import { cn } from "@/lib/utils"

interface CreatePostBoxProps {
  onSuccess?: () => void
}

interface SelectedFile {
  file: File
  preview: string
  type: "image" | "video"
}

export function CreatePostBox({ onSuccess }: CreatePostBoxProps) {
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()
  
  const { createPost, uploadMedia, isSubmitting } = usePostActions()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles: SelectedFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image"
    }))

    setSelectedFiles(prev => [...prev, ...newFiles])
    // Clear input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handlePost = async () => {
    if (!content.trim() && selectedFiles.length === 0) return

    try {
      setIsUploading(true)
      
      // 1. Upload all files parallel
      const uploadPromises = selectedFiles.map(sf => uploadMedia(sf.file))
      const uploadedUrls = await Promise.all(uploadPromises)
      
      const imageUrls = uploadedUrls.filter((url: string | null): url is string => url !== null)

      // 2. Create post
      const result = await createPost({
        content,
        postType: PostType.IMAGE_POST,
        visibility,
        imageUrls,
        imageLayout: "auto", // Default to auto
      })

      if (result) {
        setContent("")
        setSelectedFiles([])
        onSuccess?.()
      }
    } finally {
      setIsUploading(false)
    }
  }

  const renderPreviewGrid = () => {
    const count = selectedFiles.length
    if (count === 0) return null

    const containerClass = "grid gap-1 w-full overflow-hidden rounded-xl border border-border/10 mt-4 aspect-video"

    if (count === 1) {
      return (
        <div className="relative w-full aspect-[3/2] max-h-[350px] overflow-hidden rounded-xl bg-muted/20 border border-border/10">
          <img src={selectedFiles[0].preview} alt="preview" className="w-full h-full object-cover" />
          <button onClick={() => removeFile(0)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    }

    if (count === 2) {
      return (
        <div className={containerClass}>
           {selectedFiles.map((sf, i) => (
             <div key={i} className="relative h-full w-full">
               <img src={sf.preview} alt="preview" className="h-full w-full object-cover" />
               <button onClick={() => removeFile(i)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white">
                 <X className="h-3 w-3" />
               </button>
             </div>
           ))}
        </div>
      )
    }

    if (count === 3) {
      return (
        <div className={containerClass}>
           <div className="relative h-full w-full">
              <img src={selectedFiles[0].preview} alt="preview" className="h-full w-full object-cover" />
              <button onClick={() => removeFile(0)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
           </div>
           <div className="grid grid-rows-2 gap-1 h-full">
              {selectedFiles.slice(1, 3).map((sf, i) => (
                <div key={i} className="relative h-full w-full">
                  <img src={sf.preview} alt="preview" className="h-full w-full object-cover" />
                  <button onClick={() => removeFile(i + 1)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
                </div>
              ))}
           </div>
        </div>
      )
    }

    // 4 or more
    return (
      <div className={containerClass}>
        {selectedFiles.slice(0, 4).map((sf, i) => (
          <div key={i} className="relative h-full w-full">
            <img src={sf.preview} alt="preview" className="h-full w-full object-cover" />
            <button onClick={() => removeFile(i)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
            {i === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
                <span className="text-white text-2xl font-bold">+{count - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border border-border shadow-sm">
          <AvatarImage src={user?.avatar || DEFAULT_AVATAR} alt="User" />
          <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="Bạn đang nghĩ gì về cuốn sách hôm nay?"
            className="min-h-[100px] w-full resize-none border-none bg-transparent p-0 text-lg focus-visible:ring-0 placeholder:text-muted-foreground/60"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Smart Preview Grid */}
          {renderPreviewGrid()}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />

          <div className="flex items-center justify-between border-t border-border/50 pt-3">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-5 w-5" />
                <span className="text-xs font-semibold">Ảnh</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 gap-2 text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Video className="h-5 w-5" />
                <span className="text-xs font-semibold">Video</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 gap-2 text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors rounded-full"
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs font-semibold">Vị trí</span>
              </Button>
            </div>
            
            <Button 
              onClick={handlePost} 
              disabled={(!content.trim() && selectedFiles.length === 0) || isSubmitting || isUploading}
              className="px-8 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
            >
              {isSubmitting || isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Đang tải tệp..." : "Đăng bài"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
