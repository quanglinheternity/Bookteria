import axiosInstance from "@/api/axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import {
  UserProfile,
  UpdateProfileRequest,
  SearchUserResponse,
  GetMyInfoResponse
} from "../types/user.type"

export const userApi = {
  /**
   * Fetches the current user's profile information.
   */
  async getMyInfo(): Promise<GetMyInfoResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.MY_INFO)
    return response.data
  },

  /**
   * Updates the current user's profile data.
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<GetMyInfoResponse> {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData)
    return response.data
  },

  /**
   * Uploads a new avatar for the user.
   */
  async uploadAvatar(formData: FormData): Promise<any> {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  /**
   * Searches for users based on a keyword.
   */
  async search(keyword: string): Promise<SearchUserResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.SEARCH, { keyword })
    return response.data
  },

  /**
   * Fetches a specific user's profile by their user ID.
   */
  async getProfileByUserId(userId: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_PROFILE_BY_USERID(userId))
    return response.data
  },
}
