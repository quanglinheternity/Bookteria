"use client"

import { useState, useEffect } from "react"
import { UserProfile } from "@/types/user.type"
import { userService } from "@/services/user.service"

export function useUserSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const response = await userService.searchUsers(searchQuery)
          if (response.code === 1000) {
            setSearchResults(response.result)
          }
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  }
}
