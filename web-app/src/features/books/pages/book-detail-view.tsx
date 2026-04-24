"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Globe, 
  User, 
  Building2, 
  Star, 
  Eye, 
  MessageSquare,
  Download,
  Share2,
  FileText,
  Clock,
  ChevronRight
} from "lucide-react"

import { bookService } from "../services/book.service"
import { Book } from "../types/book.type"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/ui/useToast"

export function BookDetailView() {
  const { id } = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const handleShare = async () => {
    if (!book) return

    const shareData = {
      title: book.title,
      text: `Hãy cùng đọc cuốn sách "${book.title}" trên Bookteria nhé!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Thành công", "Cảm ơn bạn đã chia sẻ!")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Đã sao chép", "Đường dẫn đã được lưu vào bộ nhớ tạm.")
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err)
        toast.error("Lỗi", "Không thể chia sẻ cuốn sách này.")
      }
    }
  }

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return
      try {
        const response = await bookService.getBookDetail(parseInt(id as string))
        if (response.code === 200 || response.code === 1000) {
          setBook(response.result)
        }
      } catch (error) {
        console.error("Failed to fetch book detail:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBook()
  }, [id])

  if (isLoading) return <BookDetailSkeleton />

  if (!book) {
    return (
      <div className="container mx-auto p-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy sách</h2>
        <p className="text-muted-foreground">Cuốn sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => router.push("/books")}>Quay lại danh sách</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
          <button onClick={() => router.push("/books")} className="hover:text-primary transition-colors">Quản lý sách</button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{book.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/books")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
           <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Chia sẻ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-[2/3] w-full max-w-[320px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-border group">
             <img
                src={book.coverImageUrl || "/placeholder-book.png"}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/60 backdrop-blur-md text-white border-none px-3 py-1">
                   <Globe className="mr-1.5 h-3 w-3" /> {book.language.toUpperCase()}
                </Badge>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
             <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                   <Star className="h-4 w-4 fill-amber-500" /> {book.averageRating?.toFixed(1) || "0.0"}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Đánh giá</p>
             </div>
             <div className="text-center space-y-1 border-x border-border">
                <div className="flex items-center justify-center gap-1 text-blue-500 font-bold">
                   <Eye className="h-4 w-4" /> {book.totalReads || 0}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Lượt đọc</p>
             </div>
             <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold">
                   <MessageSquare className="h-4 w-4" /> {book.totalReviews || 0}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Nhận xét</p>
             </div>
          </div>

          {book.bookFileUrl && (
            <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" asChild>
              <a href={book.bookFileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-5 w-5" /> Đọc & Tải sách ngay
              </a>
            </Button>
          )}
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-8 space-y-8">
           <div className="space-y-4">
              <div className="space-y-2">
                {book.category && (
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-1 rounded-full text-xs">
                    {book.category.name}
                  </Badge>
                )}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif leading-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-xl text-muted-foreground italic font-light italic">{book.subtitle}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                 {book.authors?.map(author => (
                   <div key={author.id} className="flex items-center gap-2 group cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                        <User className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Tác giả</p>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{author.name}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                  <Building2 className="h-3.5 w-3.5" /> Nhà xuất bản
                </div>
                <p className="font-medium">{book.publisher || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                  <Calendar className="h-3.5 w-3.5" /> Năm xuất bản
                </div>
                <p className="font-medium">{book.publishedYear || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                  <FileText className="h-3.5 w-3.5" /> Số trang
                </div>
                <p className="font-medium">{book.pageCount || "N/A"} trang</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                  <Clock className="h-3.5 w-3.5" /> ISBN
                </div>
                <p className="font-medium">{book.isbn || "N/A"}</p>
              </div>
           </div>

           <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 gap-8">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 h-full font-bold text-base"
                >
                  Giới thiệu nội dung
                </TabsTrigger>
                <TabsTrigger 
                   value="details" 
                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 h-full font-bold text-base"
                >
                  Thông tin chi tiết
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6 focus-visible:outline-none">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-lg text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
                    {book.description || "Cuốn sách này hiện chưa có phần giới thiệu nội dung."}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details" className="py-6 space-y-4 focus-visible:outline-none">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <DetailRow label="ID Hệ thống" value={book.id.toString()} />
                    <DetailRow label="Ngày tạo" value={new Date(book.createdAt).toLocaleString("vi-VN")} />
                    <DetailRow label="Cập nhật cuối" value={new Date(book.updatedAt).toLocaleString("vi-VN")} />
                    <DetailRow label="Người tạo" value={book.createdBy} />
                    <DetailRow label="Định dạng" value={book.bookFileUrl?.endsWith(".pdf") ? "Portable Document Format (PDF)" : "EPUB / Digital"} />
                    <DetailRow label="Ngôn ngữ" value={book.language === "vi" ? "Tiếng Việt" : "Quốc tế"} />
                 </div>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
