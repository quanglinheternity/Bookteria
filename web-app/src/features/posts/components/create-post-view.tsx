"use client"

import { useState } from "react"
import {
  Camera,
  MapPin,
  Hash,
  Lightbulb,
  ImagePlus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CURRENT_USER } from "@/lib/mock-data"

const SUGGESTED_LOCATIONS = [
  "Hoan Kiem Lake",
  "Golden Bridge",
  "Hoi An Ancient Town",
  "Ha Long Bay",
  "Sa Pa Terraces",
]

export function CreatePostView() {
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [photoTip, setPhotoTip] = useState("")
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "")
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur-md">
        <h2 className="text-lg font-bold text-foreground">New Post</h2>
        <Button size="sm" disabled={!content.trim()}>
          Share
        </Button>
      </header>

      <div className="mx-auto max-w-3xl p-6">
        <div className="flex gap-8">
          {/* Left: Image Upload */}
          <div className="w-1/2">
            <div className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted">
              <ImagePlus
                className="h-12 w-12 text-muted-foreground"
                strokeWidth={1.5}
              />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Click to add photos
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Up to 10 photos
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1">
            {/* Author */}
            <div className="mb-5 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={CURRENT_USER.avatar || "/placeholder.svg"}
                  alt={`${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`}
                />
                <AvatarFallback>
                  {CURRENT_USER.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                </p>
                {location && (
                  <p className="flex items-center gap-1 text-xs text-primary">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <Textarea
              placeholder="Share your photo story, shooting experience, or tips..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none text-sm"
            />

            <Separator className="my-4" />

            {/* Location */}
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
              >
                <MapPin className="h-5 w-5 text-accent" />
                <span className="flex-1 text-sm text-foreground">
                  {location || "Add location"}
                </span>
              </button>
              {showLocationPicker && (
                <div className="ml-8 mt-1 space-y-1">
                  {SUGGESTED_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setLocation(loc)
                        setShowLocationPicker(false)
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-3">
              <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted">
                <Hash className="h-5 w-5 text-primary" />
                <Input
                  placeholder="Add tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
              {tags.length > 0 && (
                <div className="ml-8 mt-1 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Photo Tip */}
            <div className="mb-3">
              <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted">
                <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
                <Input
                  placeholder="Add a photo tip for other photographers"
                  value={photoTip}
                  onChange={(e) => setPhotoTip(e.target.value)}
                  className="flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Camera Settings */}
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Camera Settings (optional)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="ISO"
                  className="bg-card text-center text-xs"
                />
                <Input
                  placeholder="f/stop"
                  className="bg-card text-center text-xs"
                />
                <Input
                  placeholder="Shutter"
                  className="bg-card text-center text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
