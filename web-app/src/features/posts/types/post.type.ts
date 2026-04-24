export enum PostType {
  REVIEW = "REVIEW",
  SHARE = "SHARE",
  QUESTION = "QUESTION",
  IMAGE_POST = "IMAGE_POST",
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  FRIENDS = "FRIENDS",
  PRIVATE = "PRIVATE",
}

export interface UserResponse {
  userId: string | undefined
  id: string
  firstName: string
  lastName: string
  avatar: string
}

export interface PostResponse {
  images: any
  id: string
  user: UserResponse
  bookId?: number
  content: string
  postType: PostType
  imageUrls: string[]
  imageLayout?: string
  videoUrl?: string
  likeCount: number
  commentCount: number
  shareCount: number
  visibility: Visibility
  created: string // Human readable like "2 hours ago"
  createdAt: string // ISO date
  updatedAt: string // ISO date
  isLiked?: boolean // Added for UI state
}

export interface PostCreationRequest {
  content: string
  bookId?: number
  postType: PostType
  imageUrls: string[]
  imageLayout?: string
  videoUrl?: string
  visibility: Visibility
}

export interface PostUpdateRequest {
  content?: string
  postType?: PostType
  imageUrls?: string[]
  imageLayout?: string
  videoUrl?: string
  visibility?: Visibility
}

export interface FileResponse {
  url: string
}
