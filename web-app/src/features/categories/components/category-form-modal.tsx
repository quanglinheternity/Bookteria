"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Category } from "../types/category.type"
import { useCategoryActions } from "../hooks/useCategories"

const categorySchema = z.object({
  name: z.string().min(1, "Tên thể loại không được để trống").max(100),
  description: z.string().max(500).optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormModalProps {
  category?: Category | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CategoryFormModal({
  category,
  isOpen,
  onClose,
  onSuccess
}: CategoryFormModalProps) {
  const { createCategory, updateCategory, isSubmitting } = useCategoryActions()
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
      })
    } else {
      form.reset({
        name: "",
        description: "",
      })
    }
  }, [category, form, isOpen])

  async function onSubmit(values: CategoryFormValues) {
    let result
    if (category) {
      result = await updateCategory(category.id, values)
    } else {
      result = await createCategory(values)
    }

    if (result) {
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}</DialogTitle>
          <DialogDescription>
            {category 
              ? "Cập nhật thông tin cho thể loại này." 
              : "Điền thông tin bên dưới để tạo một thể loại sách mới."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thể loại</FormLabel>
                  <FormControl>
                    <Input placeholder="Văn học, Kinh tế, Kỹ năng..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả ngắn gọn về thể loại này..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : null}
                {category ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
