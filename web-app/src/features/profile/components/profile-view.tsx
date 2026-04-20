"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Settings,
  Grid3X3,
  Bookmark,
  MapPin,
  Camera,
  Award,
  Heart,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfileModal } from "./edit-profile-modal"
import type { Post } from "@/lib/mock-data"
import { UserProfile } from "@/types/user.type"
import { userService } from "@/services/user.service"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_AVATAR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACUCAMAAADWBFkUAAAAJFBMVEXU1NT////R0dH6+vrZ2dn19fXj4+Pe3t7u7u7y8vLm5ubp6eklnMeNAAADW0lEQVR4nO2b3RKjIAyFMYAovv/7rki7tVttFU4S3eG76fTuTObkBwzGNBqNRqPRaDQajUbjf4My2jJ+M2t0LvSJ4Jy5smQiF0dvre0S868fo7uoYBeGboshOG1pH4TJbmpdojwFbXlryI37Whe9o7uMIdy2Bf4xxEX80H+P69/49tpCE0cC+wivtlRyxwL7CK+ue6k/oTXRa8o9K3aWq6aVDubXGqsW3fORVYxuKBLbdSqN7VQ1WGM1+oQvFNt1XlwrTcViu24SzjQqNW0mCMst90FC2AtlxeuFbBmrC61scE+PB6rBpdJS+8KK5VllQciIlQUaAWpHKbXFPXeNVP8F5FhCanQ8fhL7htApzSFsOxtXxgoQ24oZF1G/EjJTOSbJhNoZYZJsTjOJogDpDQmR/kC189cTL6IWUxKEBpumtql9qL1Xlt2q3pqae481k4TYe3Xem00195oYDWgalxELSjOZJLvbKbL6FiwhdhMG6Q8yvSHhAGrlPj4ARgWRIeFBfYMQ/Qx1p9vm+uDKfuGrLAtyBSGrrSsL0nsKFCvERvHv6BVeEPbBgiutC15le6nUujqrVoWZprUJRKFgU0X6g3SNXEWx5vQZTXkh7NwhTeoo9oXjbSJqSzWpNBwrvF7bBQ+o/63Xq+4EvkEmftfro7mM2IWwn27jpRaxM2R6/1nPrO8vFtYnRC7EYXlDYJf3A0MMV31BsLBoc5nn30aj0bgF9Im2pE2SrLk3jO/zgh9jeq91Mc1kXBw2+m7uvUN0F+q+5KYdpS/F00WmWxMOTuP6k9g82R4/R1rtKffHFP4RX0W9d3qnQ4ceGH4yaOQbnTDsP+EVv76lqqv8QbhdFF/eZkTvFkouF98RvL2rFysot+oDyQuZXAOJlZELeZqR4TcDaPEjw97XQAtLGfa1JdQSY4b3Uzpsh/EJ52dJqGkzjNaFmjbDaF20DxJsz3VwlXYN03ENtoL9Ds9CNkOKZVgSrXKk3YdlX6H4ZPMLy/GNkiu0LB2NpyBk4GUB9vJpC/xrKEaxXQfWyla+MuAiBnvusg14v5VhnlmDnW2YjYC2Asf0tQY7iXHWrwR0P4jZtmDj3kstZ9vNIJsv6jJpH+Qchnqutw/wjRFzJ0sAu9nN1HKXhKNnyT+fFCdN3paSEgAAAABJRU5ErkJggg=="

interface ProfileViewProps {
  user: UserProfile
  posts: Post[]
  isOwnProfile?: boolean
  showBackButton?: boolean
  onProfileUpdate?: () => void
}

export function ProfileView({
  user,
  posts,
  isOwnProfile = false,
  showBackButton = false,
  onProfileUpdate,
}: ProfileViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [following, setFollowing] = useState(user.isFollowing)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)

  const userPosts = posts.filter((p) => p.author.id === user.id)
  const savedPosts = posts.filter((p) => p.isSaved)

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hidden File Input for Direct Upload */}
      {isOwnProfile && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-1.5 text-foreground hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg font-bold text-foreground">
            {user.username}
          </h2>
        </div>
        {isOwnProfile && (
          <Link
            href="/settings"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        )}
      </header>

      {/* Profile Info - Desktop Layout */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex gap-10">
          <div
            className={cn(
              "relative group h-32 w-32 shrink-0 rounded-full overflow-hidden",
              isOwnProfile && "cursor-pointer transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handleAvatarClick}
          >
            <Avatar className="h-full w-full ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
              <AvatarImage src={user.avatar || DEFAULT_AVATAR} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-3xl">
                {user.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                isAvatarUploading ? "bg-black/40 opacity-100" : "bg-black/20 opacity-0 group-hover:opacity-100"
              )}>
                {isAvatarUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-xs text-primary"
              >
                <Award className="h-3 w-3" />
                {user.level}
              </Badge>
            </div>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>

            {/* Stats */}
            <div className="mt-5 flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {user.postsCount}
                </span>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {user.followersCount.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {user.followingCount}
                </span>
                <span className="text-xs text-muted-foreground">
                  Following
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-3">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm"
                    size="sm"
                  >
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={cn(
                      "text-sm",
                      following &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    size="sm"
                    onClick={() => setFollowing(!following)}
                  >
                    {following ? "Following" : "Follow"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm"
                    size="sm"
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stat Highlights */}
        <div className="mt-6 flex gap-3">
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Camera className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {userPosts.length} photos
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-foreground">
              {new Set(userPosts.map((p) => p.location.province)).size}{" "}
              provinces
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {user.level}
            </span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="text-xs font-medium">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent py-3 text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-xs font-medium">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1 lg:grid-cols-4">
                {userPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="group relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={post.images[0] || "/placeholder.svg"}
                      alt={`Post by ${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/30 group-hover:opacity-100">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-card">
                        <Heart className="h-4 w-4 fill-current" />
                        {post.likesCount}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Camera className="h-12 w-12" strokeWidth={1} />
                <p className="mt-3 text-sm">No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1 lg:grid-cols-4">
                {savedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="group relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={post.images[0] || "/placeholder.svg"}
                      alt="Saved post"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 1024px) 33vw, 25vw"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bookmark className="h-12 w-12" strokeWidth={1} />
                <p className="mt-3 text-sm">No saved posts</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {isOwnProfile && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => onProfileUpdate?.()}
          defaultAvatar={DEFAULT_AVATAR}
        />
      )}
    </div>
  )
}
