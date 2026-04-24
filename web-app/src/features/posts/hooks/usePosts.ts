"use client"

import { useState, useEffect, useCallback, useRef, } from "react"
import { PostResponse } from "../types/post.type"
import { postService } from "../services/post.service"
import { useToast } from "@/hooks/ui/useToast"

export function usePosts(
  userId?: string,
  initialPage = 1,
  initialSize = 10,
  isOwnProfile?: boolean
) {
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalElements: 0,
    pageSize: initialSize,
  })
  const { toast } = useToast()
  const lastParamsRef = useRef<string>("")

  const fetchPosts = useCallback(
    async (page: number, size: number) => {
      // Create a unique key for the current request
      const requestKey = `${userId}-${page}-${size}-${isOwnProfile}`
      if (lastParamsRef.current === requestKey) return
      
      if (userId === "undefined") return

      try {
        setIsLoading(true)
        lastParamsRef.current = requestKey

        let response
        if (isOwnProfile) {
          response = await postService.getMyPosts(page, size)
        } else if (userId && userId !== "undefined") {
          response = await postService.getPostsByUserId(userId, page, size)
        } else {
          response = await postService.getAllPosts(page, size)
        }

      if (response.code === 200 || response.code === 1000) {
        setPosts(response.result.data)
        setPagination({
          currentPage: response.result.currentPage,
          totalPages: response.result.totalPages,
          totalElements: response.result.totalElements,
          pageSize: response.result.pageSize,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, userId, isOwnProfile])

  useEffect(() => {
    fetchPosts(pagination.currentPage, pagination.pageSize)
  }, [fetchPosts, pagination.currentPage, pagination.pageSize])

  const refresh = () => fetchPosts(pagination.currentPage, pagination.pageSize)

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return {
    posts,
    isLoading,
    pagination,
    refresh,
    handlePageChange
  }
}
