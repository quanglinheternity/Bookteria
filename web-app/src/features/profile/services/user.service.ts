import { userApi } from "../api/user.api"
import { UpdateProfileRequest } from "../types/user.type"

export const userService = {
  /**
   * Orchestrates fetching current user info.
   */
  async fetchMyInfo() {
    try {
      const response = await userApi.getMyInfo()
      return response
    } catch (error) {
      console.error("fetchMyInfo service error:", error)
      throw error
    }
  },

  /**
   * Orchestrates updating user profile.
   */
  async updateUserProfile(data: UpdateProfileRequest) {
    try {
      const response = await userApi.updateProfile(data)
      return response
    } catch (error) {
      console.error("updateUserProfile service error:", error)
      throw error
    }
  },

  /**
   * Orchestrates uploading user avatar.
   */
  async uploadUserAvatar(file: File) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await userApi.uploadAvatar(formData)
      return response
    } catch (error) {
      console.error("uploadUserAvatar service error:", error)
      throw error
    }
  },

  /**
   * Orchestrates user search.
   */
  async searchUsers(keyword: string) {
    try {
      const response = await userApi.search(keyword)
      return response
    } catch (error) {
      console.error("searchUsers service error:", error)
      throw error
    }
  },

  /**
   * Orchestrates fetching any user profile by ID.
   */
  async getUserProfile(userId: string) {
    try {
      const response = await userApi.getProfileByUserId(userId)
      return response
    } catch (error) {
      console.error("getUserProfile service error:", error)
      throw error
    }
  },
}
