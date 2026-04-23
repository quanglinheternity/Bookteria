import axios from "axios"
import { API_BASE_URL } from "@/constants/api.endpoint"
import { authService } from "@/features/auth"
import { tokenService } from "@/services/token.service"
import { ROUTES } from "@/constants/routes"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle 401 and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true

      try {
        const response = await authService.handleRefreshToken()
        
        if (response && response.code === 1000) {
          const newToken = response.result.token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError)
        
        // Only redirect to login if the refresh attempt actually failed with a definitive "Invalid Token" response
        // If the identity service is simply down, we don't want to kick the user out.
        if (refreshError.response && refreshError.response.status >= 400 && refreshError.response.status < 500) {
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
