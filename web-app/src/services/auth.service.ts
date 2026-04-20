import { authApi } from "@/api/auth.api"
import { tokenService } from "./token.service"
import { LoginRequest } from "@/types/auth.type"

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
    } catch (error) {
      console.error("Refresh token service error:", error)
      this.handleLogout()
      throw error
    }
  },
}
