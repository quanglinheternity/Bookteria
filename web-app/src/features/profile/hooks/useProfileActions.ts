"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { userService } from "../services/user.service"
import { useChatActions } from "@/features/messages/hooks/useChat"
import { useToast } from "@/hooks/ui/useToast"
import { UserProfile } from "../types/user.type"

export function useProfileActions(user: UserProfile, onProfileUpdate?: () => void) {
  const router = useRouter()
  const { toast } = useToast()

  const [following, setFollowing] = useState(user.isFollowing)
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Sync state with prop updates
  useEffect(() => {
    setFollowing(user.isFollowing)
    setFollowersCount(user.followersCount || 0)
  }, [user.isFollowing, user.followersCount])

  const { createConversation, isSending: isMessageLoading } = useChatActions()

  const handleFollow = async () => {
    if (isFollowLoading) return

    setIsFollowLoading(true)
    const originalFollowing = following
    const originalCount = followersCount

    // Optimistic update
    setFollowing(!originalFollowing)
    setFollowersCount(prev => originalFollowing ? prev - 1 : prev + 1)

    try {
      if (originalFollowing) {
        await userService.unfollowUser(user.userId)
        toast.success(`Đã bỏ theo dõi ${user.firstName + ' ' + user.lastName}`)
      } else {
        await userService.followUser(user.userId)
        toast.success(`Đã theo dõi ${user.firstName + ' ' + user.lastName}`)
      }
      onProfileUpdate?.()
    } catch (error) {
      console.error("Error following/unfollowing:", error)
      toast.error("Thao tác thất bại. Vui lòng thử lại.")
      // Rollback
      setFollowing(originalFollowing)
      setFollowersCount(originalCount)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleMessage = async () => {
    const result = await createConversation({
      type: "PRIVATE",
      participantIds: [user.userId]
    })

    if (result) {
      router.push(`/messages?conversationId=${result.id}`)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setIsAvatarUploading(true)
    try {
      await userService.uploadUserAvatar(file)
      toast.success("Ảnh đại diện đã được cập nhật!")
      onProfileUpdate?.()
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error("Không thể tải lên ảnh đại diện. Vui lòng thử lại.")
    } finally {
      setIsAvatarUploading(false)
    }
  }

  return {
    following,
    followersCount,
    isFollowLoading,
    isAvatarUploading,
    isEditModalOpen,
    setIsEditModalOpen,
    isMessageLoading,
    handleFollow,
    handleMessage,
    handleAvatarUpload
  }
}
