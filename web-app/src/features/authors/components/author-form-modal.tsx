"use client"

import { useState, useEffect, useRef } from "react"
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
import { Author } from "../types/author.type"
import { useAuthorActions } from "../hooks/useAuthors"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X } from "lucide-react"
import { DEFAULT_AVATAR } from "@/constants/image"

const authorSchema = z.object({
  name: z.string().min(1, "Tên tác giả không được để trống").max(100),
  bio: z.string().max(1000).optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
})

type AuthorFormValues = z.infer<typeof authorSchema>

interface AuthorFormModalProps {
  author?: Author | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthorFormModal({
  author,
  isOpen,
  onClose,
  onSuccess
}: AuthorFormModalProps) {
  const { createAuthor, updateAuthor, isSubmitting } = useAuthorActions()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
      bio: "",
      birthDate: "",
      nationality: "",
    },
  })

  useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
        bio: author.bio || "",
        birthDate: author.birthDate || "",
        nationality: author.nationality || "",
      })
      setPreviewUrl(author.avatarUrl || null)
    } else {
      form.reset({
        name: "",
        bio: "",
        birthDate: "",
        nationality: "",
      })
      setPreviewUrl(null)
    }
    setSelectedImage(null)
  }, [author, form, isOpen])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: AuthorFormValues) {
    const payload = {
      ...values,
      avatar: selectedImage || undefined,
    }

    let result
    if (author) {
      result = await updateAuthor(author.id, payload)
    } else {
      result = await createAuthor(payload)
    }

    if (result) {
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{author ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết và ảnh đại diện cho tác giả.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          <div className="group relative">
            <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-1 ring-border">
              <AvatarImage src={previewUrl || DEFAULT_AVATAR} className="object-cover" />
              <AvatarFallback className="text-2xl">{form.getValues("name")?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera className="h-8 w-8 text-white" />
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null)
                  setPreviewUrl(author?.avatarUrl || null)
                }}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground font-medium">Nhấp để thay đổi ảnh đại diện</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tên tác giả</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Nhật Ánh, J.K. Rowling..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc tịch</FormLabel>
                    <FormControl>
                      <Input placeholder="Việt Nam, Anh, Mỹ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Viết một đoạn ngắn về tác giả..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : null}
                {author ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
