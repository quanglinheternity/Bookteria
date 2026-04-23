import { authApi } from "../api/auth.api"
import { tokenService } from "@/services/token.service"
import { LoginRequest } from "../types/auth.type"

export const authService = {
  async handleLogin(credentials: LoginRequest) {
    const response = await authApi.login(credentials)
    
    if (response.code === 1000) {
      tokenService.setTokens(
        response.result.token,
        response.result.refreshToken,
        response.result.expiryTime
      )
    }
    
    return response
  },

  async handleLogout() {
    const token = tokenService.getToken()
    
    try {
      if (token) {
        await authApi.logout(token)
      }
    } catch (error) {
      console.error("Logout service error:", error)
    } finally {
      tokenService.clearTokens()
    }
  },

  async handleRefreshToken() {
    const refreshToken = tokenService.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await authApi.refreshToken(refreshToken)
      if (response.code === 1000) {
        tokenService.setTokens(
          response.result.token,
          response.result.refreshToken,
          response.result.expiryTime
        )
      }
      return response
    } catch (error: any) {
      console.error("Refresh token service error:", error)
      
      // Only logout and clear cookies if the server explicitly tells us the token is invalid (4xx)
      // If it's a network error (no response) or server error (5xx), we keep the cookies.
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        this.handleLogout()
      }
      
      throw error
    }
  },
}
