"use client"

import { useState, useRef } from "react"
import { PostType, Visibility } from "../types/post.type"
import { usePostActions } from "./usePostActions"

export interface SelectedFile {
  file: File
  preview: string
  type: "image" | "video"
}

export function useCreatePost(onSuccess?: () => void) {
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
        imageLayout: "auto",
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

  return {
    content,
    setContent,
    visibility,
    setVisibility,
    selectedFiles,
    setSelectedFiles,
    fileInputRef,
    isSubmitting,
    isUploading,
    handleFileSelect,
    removeFile,
    handlePost
  }
}
