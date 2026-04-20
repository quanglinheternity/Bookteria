"use client"

import { useState, useRef } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { UserProfile, UpdateProfileRequest } from "@/types/user.type"
import { userService } from "@/services/user.service"
import { useToast } from "@/hooks/use-toast"

interface UseEditProfileProps {
  user: UserProfile
  onSuccess: () => void
  onClose: () => void
}

export function useEditProfile({ user, onSuccess, onClose }: UseEditProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const form = useForm<UpdateProfileRequest>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
    },
  })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (data: UpdateProfileRequest) => {
    setIsLoading(true)
    try {
      // 1. Update basic info
      await userService.updateUserProfile(data)

      // 2. Upload avatar if selected
      if (selectedFile) {
        await userService.uploadUserAvatar(selectedFile)
      }

      toast.success("Hồ sơ đã được cập nhật thành công!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    avatarPreview,
    fileInputRef,
    onFileChange,
    handleAvatarClick,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
