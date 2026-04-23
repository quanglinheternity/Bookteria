"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth.service"
import { tokenService } from "@/services/token.service"
import { LoginRequest } from "../types/auth.type"
import { useToast } from "@/hooks/ui/useToast"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.handleLogin(credentials)

      if (response.code === 1000) {
        toast.success(
          "Đăng nhập thành công",
          "Chào mừng bạn quay trở lại với Vietnam Photo Scout!"
        )
        router.push("/")
        return true
      } else if (response.code === 1007) {
        setError("Tài khoản hoặc mật khẩu không chính xác")
        toast.error("Đăng nhập thất bại", "Thông tin đăng nhập không hợp lệ.")
      } else {
        setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.")
        toast.error("Đăng nhập thất bại", "Mã lỗi: " + response.code)
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
      toast.error("Lỗi kết nối", "Không thể kết nối đến dịch vụ.")
    } finally {
      setIsLoading(false)
    }
    return false
  }

  const logout = async () => {
    try {
      await authService.handleLogout()
      toast.success("Đã đăng xuất thành công")
      router.push("/login")
    } catch (error) {
      console.error("Logout hook error:", error)
    }
  }

  return {
    login,
    logout,
    isLoading,
    error,
    setError,
    isAuthenticated: tokenService.isAuthenticated(),
  }
}
