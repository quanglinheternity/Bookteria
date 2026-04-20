"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Upload, AlertCircle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface LocationPostFormProps {
  locationId: string
  locationName: string
  onClose: () => void
}

export function LocationPostForm({
  locationId,
  locationName,
  onClose,
}: LocationPostFormProps) {
  const [postType, setPostType] = useState<"warning" | "tip">("tip")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      // In real app, upload to storage. For now, create preview URLs
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          setImages((prev) => [...prev, result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, this would save to database with locationId
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Post created:", {
        locationId,
        type: postType,
        content,
        images,
      })
      onClose()
    } catch (error) {
      console.error("[v0] Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Đăng bài tại {locationName}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Post Type Selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Loại bài viết</p>
        <RadioGroup value={postType} onValueChange={(value) => setPostType(value as "warning" | "tip")}>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="tip" id="tip" />
            <Label htmlFor="tip" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="font-medium text-foreground">Mẹo hay</p>
                  <p className="text-xs text-muted-foreground">Chia sẻ kinh nghiệm, mẹo chụp ảnh</p>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="warning" id="warning" />
            <Label htmlFor="warning" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium text-foreground">Cảnh báo</p>
                  <p className="text-xs text-muted-foreground">Thông báo về tình trạng, nguy hiểm</p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-semibold text-foreground">
          Nội dung
        </Label>
        <Textarea
          id="content"
          placeholder={
            postType === "tip"
              ? "Ví dụ: Giờ vàng tốt nhất là từ 5h30 đến 6h45. Nên đến sớm để chọn vị trí tốt..."
              : "Ví dụ: Hiện tại trời có mưa lớn, vượt cỏ khó đi. Nên chờ thời tiết sáng..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none"
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Hình ảnh</Label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 cursor-pointer transition-colors hover:border-primary hover:bg-muted/50">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Nhấp để tải lên hoặc kéo & thả</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF tối đa 5MB</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="flex-1"
        >
          {isLoading ? "Đang đăng..." : "Đăng bài"}
        </Button>
      </div>
    </form>
  )
}
