"use client"

import { Loader2, Upload, X, Book as BookIcon, Search } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Book } from "../types/book.type"
import { useBookForm } from "../hooks/useBookForm"

interface BookFormModalProps {
  book?: Book | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BookFormModal({
  book,
  isOpen,
  onClose,
  onSuccess,
}: BookFormModalProps) {
  const {
    form,
    isSubmitting,
    coverPreview,
    bookFile,
    authorSearch,
    authorsList,
    categorySearch,
    categoriesList,
    setAuthorSearch,
    setCategorySearch,
    handleCoverChange,
    handleBookFileChange,
    removeBookFile,
    handleSubmit,
  } = useBookForm({ book, isOpen, onClose, onSuccess })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Chỉnh sửa sách" : "Thêm sách mới"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Cover Image & Files */}
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <FormLabel>Ảnh bìa</FormLabel>
                  <div 
                    className="relative aspect-[2/3] w-full max-w-[180px] overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer group hover:border-primary/50 transition-colors"
                    onClick={() => document.getElementById("cover-input")?.click()}
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-xs">Tải ảnh lên</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <input
                    id="cover-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>File sách (PDF/EPUB)</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => document.getElementById("book-file-input")?.click()}
                    >
                      <BookIcon className="mr-2 h-4 w-4" />
                      {bookFile ? bookFile.name : "Chọn file"}
                    </Button>
                    {bookFile && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeBookFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    id="book-file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.epub"
                    onChange={handleBookFileChange}
                  />
                  {book?.bookFileUrl && !bookFile && (
                    <p className="text-[10px] text-primary truncate">Hiện có: {book.bookFileUrl.split("/").pop()}</p>
                  )}
                </div>
              </div>

              {/* Right Columns: Book Stats */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Tiêu đề *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề sách" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ISBN-13" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà xuất bản</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NXB Trẻ, Kim Đồng..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                       <div className="flex items-center justify-between">
                        <FormLabel>Thể loại</FormLabel>
                        <div className="relative w-48">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input 
                            placeholder="Tìm thể loại..." 
                            className="h-7 pl-7 text-[10px]"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 flex-wrap gap-2 min-h-[80px] p-2 border rounded-md bg-muted/30">
                        {categoriesList
                          .filter(cat => 
                            cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
                            field.value === cat.id.toString()
                          )
                          .slice(0, categorySearch ? categoriesList.length : 10)
                          .map((cat) => (
                            <Button
                              key={cat.id}
                              type="button"
                              variant={field.value === cat.id.toString() ? "default" : "outline"}
                              className="h-8 text-xs justify-start px-2 py-1 overflow-hidden"
                              onClick={() => field.onChange(cat.id.toString())}
                            >
                              <span className="truncate">{cat.name}</span>
                            </Button>
                          ))}
                        {categoriesList.length === 0 && (
                          <div className="col-span-2 text-center text-[10px] text-muted-foreground py-4 italic">
                            Chưa có thể loại nào
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngôn ngữ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">Tiếng Anh</SelectItem>
                          <SelectItem value="fr">Tiếng Pháp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm xuất bản</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số trang</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Tác giả</FormLabel>
                    <div className="relative w-48">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input 
                        placeholder="Tìm tác giả..." 
                        className="h-7 pl-7 text-[10px]"
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border rounded-md p-2 bg-muted/30">
                    {authorsList
                      .filter(author => 
                        author.name.toLowerCase().includes(authorSearch.toLowerCase()) ||
                        form.watch("authorIds").includes(author.id.toString())
                      )
                      .slice(0, authorSearch ? authorsList.length : 10)
                      .map((author) => (
                        <div key={author.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id={`author-${author.id}`}
                            value={author.id.toString()}
                            checked={form.watch("authorIds").includes(author.id.toString())}
                            onChange={(e) => {
                              const val = author.id.toString()
                              const current = form.getValues("authorIds")
                              if (e.target.checked) {
                                form.setValue("authorIds", [...current, val])
                              } else {
                                form.setValue("authorIds", current.filter(id => id !== val))
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`author-${author.id}`} className="text-xs font-medium cursor-pointer line-clamp-1">
                            {author.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Nhập giới thiệu ngắn về cuốn sách..." 
                          className="h-24 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {book ? "Cập nhật" : "Tạo sách"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
