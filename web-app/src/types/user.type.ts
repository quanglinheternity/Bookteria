export interface UserProfile {
  id: string
  userId: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  level: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  bio?: string
}

export interface SearchUserRequest {
  keyword: string
}

export interface SearchUserResponse {
  code: number
  result: UserProfile[]
}

export interface GetMyInfoResponse {
  code: number
  result: UserProfile
}
