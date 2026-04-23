"use client"

import { useState, useEffect, useCallback } from "react"
import { Category } from "../types/category.type"
import { categoryService } from "../services/category.service"
import { useToast } from "@/hooks/ui/useToast"

export function useCategories(page = 1, size = 10) {
  const [categories, setCategories] = useState<Category[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await categoryService.getAllCategories(page, size, keyword)
      if (response.code === 1000) {
        setCategories(response.result.data)
        setTotalElements(response.result.totalElements)
        setTotalPages(response.result.totalPages)
        setError(null)
      }
    } catch (err: any) {
      console.error("useCategories error:", err)
      setError(err?.message || "Không thể tải danh sách thể loại")
      toast.error("Lỗi", "Không thể tải danh sách thể loại")
    } finally {
      setIsLoading(false)
    }
  }, [page, size, keyword, toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword || undefined)
  }

  return {
    categories,
    totalElements,
    totalPages,
    isLoading,
    error,
    refresh: fetchCategories,
    handleSearch,
    setCategories
  }
}

export function useCategoryActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const createCategory = async (data: any) => {
    try {
      setIsSubmitting(true)
      const response = await categoryService.createCategory(data)
      if (response.code === 1000) {
        toast.success("Thành công", "Thể loại đã được tạo")
        return response.result
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể tạo thể loại")
    } finally {
      setIsSubmitting(false)
    }
    return null
  }

  const updateCategory = async (id: number, data: any) => {
    try {
      setIsSubmitting(true)
      const response = await categoryService.updateCategory(id, data)
      if (response.code === 1000) {
        toast.success("Thành công", "Cập nhật thể loại thành công")
        return response.result
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể cập nhật thể loại")
    } finally {
      setIsSubmitting(false)
    }
    return null
  }

  const deleteCategory = async (id: number) => {
    try {
      setIsSubmitting(true)
      const response = await categoryService.deleteCategory(id)
      if (response.code === 1000) {
        toast.success("Thành công", "Đã xóa thể loại")
        return true
      }
    } catch (err: any) {
      toast.error("Lỗi", err?.message || "Không thể xóa thể loại")
    } finally {
      setIsSubmitting(false)
    }
    return false
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isSubmitting
  }
}
