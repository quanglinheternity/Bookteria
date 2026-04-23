"use client"

import { useState, useEffect, useCallback } from "react"
import { UserProfile } from "../types/user.type"
import { userService } from "../services/user.service"
import { useToast } from "@/hooks/ui/useToast"

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userService.fetchMyInfo()
      if (response.code === 1000) {
        setUser(response.result)
        setError(null)
      }
    } catch (err: any) {
      console.error("useUser error:", err)
      setError(err?.message || "Không thể tải thông tin người dùng")
      // We don't necessarily toast here as it might be an unauthenticated state
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, isLoading, error, refresh: fetchUser, setUser }
}
