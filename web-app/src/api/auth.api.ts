import axiosInstance from "./axios-instance"
import { API_ENDPOINTS } from "@/constants/api.endpoint"
import { LoginRequest, LoginResponse, RefreshTokenResponse } from "@/types/auth.type"

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  },

  async logout(token: string): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { token })
    return response.data
  },

  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    // Note: Refresh token call should probably use its own headers or a specific instance 
    // to avoid infinite loops if it also returns 401. 
    // But for now, we'll use the same instance or a separate fetch if necessary.
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, { token })
    return response.data
  },
}
