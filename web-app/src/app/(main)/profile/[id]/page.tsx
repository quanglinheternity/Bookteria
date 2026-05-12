"use client"

import { useState, useEffect } from "react"
import { ProfileView } from "@/features/profile/components/profile-view"
import { usePosts } from "@/features/posts"
import { useUser } from "@/features/profile/hooks/useUser"
import { userService } from "@/features/profile/services/user.service"
import { UserProfile } from "@/features/profile/types/user.type"
import { Loader2 } from "lucide-react"
import { useParams, notFound } from "next/navigation"

export default function UserProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { posts: userPosts, isLoading: isPostsLoading } = usePosts(id as string)

  const isOwnProfile = currentUser?.userId === id

  const fetchProfile = async () => {
    try {
      const response = await userService.getUserProfile(id as string)
      if (response.code === 200 || response.code === 1000) {
        setProfile(response.result)
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  useEffect(() => {
    if (id) {
      setIsLoadingProfile(true)
      fetchProfile().finally(() => setIsLoadingProfile(false))
    }
  }, [id])

  const isLoading = isLoadingProfile || isPostsLoading

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <ProfileView 
      user={profile} 
      posts={userPosts as any} 
      showBackButton 
      isOwnProfile={isOwnProfile}
      onProfileUpdate={fetchProfile}
    />
  )
}
