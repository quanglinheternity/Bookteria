export interface CommentResponse {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  likeCount: number
  replyCount: number
  createdAt: string
  replies?: CommentResponse[]
  isLiked?: boolean // Added for UI
}

export interface CommentCreationRequest {
  postId: string
  parentId?: string
  content: string
}

export interface CommentUpdateRequest {
  content: string
}
