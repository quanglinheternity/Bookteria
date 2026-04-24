"use client"

import { useState, useEffect, useCallback } from "react"
import { UserProfile } from "../types/user.type"
import { userService } from "../services/user.service"
import { useToast } from "@/hooks/ui/useToast"

let globalUser: UserProfile | null = null;
let globalFetchPromise: Promise<any> | null = null;

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(globalUser)
  const [isLoading, setIsLoading] = useState(!globalUser)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUser = useCallback(async (force = false) => {
    if (globalUser && !force) {
      setUser(globalUser)
      setIsLoading(false)
      return
    }

    if (globalFetchPromise && !force) {
      try {
        const response = await globalFetchPromise
        if (response.code === 1000) {
          setUser(response.result)
          setIsLoading(false)
          return
        }
      } catch (err) {
        // Fall through to new fetch if previous failed
      }
    }

    try {
      setIsLoading(true)
      globalFetchPromise = userService.fetchMyInfo()
      const response = await globalFetchPromise
      if (response.code === 1000) {
        globalUser = response.result
        setUser(globalUser)
        setError(null)
      }
    } catch (err: any) {
      console.error("useUser error:", err)
      setError(err?.message || "Không thể tải thông tin người dùng")
    } finally {
      setIsLoading(false)
      globalFetchPromise = null
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { 
    user, 
    isLoading, 
    error, 
    refresh: () => fetchUser(true), 
    setUser: (u: UserProfile | null) => {
      globalUser = u
      setUser(u)
    } 
  }
}
