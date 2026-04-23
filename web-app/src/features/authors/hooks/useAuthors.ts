"use client"

import { useState, useEffect, useCallback } from "react"
import { Author, AuthorCreationRequest } from "../types/author.type"
import { authorService } from "../services/author.service"
import { useToast } from "@/hooks/ui/useToast"

export function useAuthors(page = 1, size = 10) {
  const [authors, setAuthors] = useState<Author[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  const fetchAuthors = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await authorService.getAllAuthors(page, size, keyword)
      if (response.code === 1000) {
        setAuthors(response.result.data)
        setTotalElements(response.result.totalElements)
        setTotalPages(response.result.totalPages)
        setError(null)
      }
    } catch (err: any) {
      console.error("useAuthors error:", err)
      setError(err?.message || "Không thể tải danh sách tác giả")
      toast.error("Lỗi", "Không thể tải danh sách tác giả")
    } finally {
      setIsLoading(false)
    }
  }, [page, size, keyword, toast])

  useEffect(() => {
    fetchAuthors()
  }, [fetchAuthors])

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword || undefined)
  }

  return {
    authors,
    totalElements,
    totalPages,
    isLoading,
    error,
    refresh: fetchAuthors,
    handleSearch,
  }
}

export function useAuthorActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const createAuthor = async (data: AuthorCreationRequest) => {
    try {
      setIsSubmitting(true)
      const response = await authorService.createAuthor(data)
      if (response.code === 1000) {
        toast.success("Thành công", "Tác giả đã được tạo")
        return response.result
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể tạo tác giả")
    } finally {
      setIsSubmitting(false)
    }
    return null
  }

  const updateAuthor = async (id: number, data: any) => {
    try {
      setIsSubmitting(true)
      const response = await authorService.updateAuthor(id, data)
      if (response.code === 1000) {
        toast.success("Thành công", "Cập nhật tác giả thành công")
        return response.result
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể cập nhật tác giả")
    } finally {
      setIsSubmitting(false)
    }
    return null
  }

  const deleteAuthor = async (id: number) => {
    try {
      setIsSubmitting(true)
      const response = await authorService.deleteAuthor(id)
      if (response.code === 1000) {
        toast.success("Thành công", "Đã xóa tác giả")
        return true
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể xóa tác giả")
    } finally {
      setIsSubmitting(false)
    }
    return false
  }

  return {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    isSubmitting
  }
}
