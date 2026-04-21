"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/user.service"
import { UserProfile } from "@/types/user.type"

export function useUser() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.fetchMyInfo()
      if (response.code === 1000) {
        setUserData(response.result)
      } else {
        setError("Không thể tải thông tin profile")
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Đã có lỗi xảy ra khi kết nối đến máy chủ")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    userData,
    isLoading,
    error,
    refreshProfile: fetchProfile,
  }
}
