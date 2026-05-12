"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Star, 
  Share2,
  Play,
  Plus,
  ChevronRight,
  Clock,
  Book as BookIcon,
  Award,
  Users,
  Loader2,
  Globe,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Eye,
  Bookmark
} from "lucide-react"

import { bookService } from "../services/book.service"
import { Book } from "../types/book.type"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/ui/useToast"
import { cn } from "@/lib/utils"

export function BookDetailView() {
  const { id } = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [similarBooks, setSimilarBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const handleShare = async () => {
    if (!book) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: `Cùng đọc "${book.title}" trên Bookteria!`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Đã sao chép liên kết")
      }
    } catch (err) {}
  }

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return
      try {
        const response = await bookService.getBookDetail(parseInt(id as string))
        if (response.code === 1000) {
          setBook(response.result)
          
          // Fetch similar books in same category
          if (response.result.category?.id) {
            const similarResponse = await bookService.searchBooks({
              categoryId: response.result.category.id,
              size: 6
            })
            if (similarResponse.code === 1000) {
              setSimilarBooks(similarResponse.result.data.filter((b: Book) => b.id !== response.result.id))
            }
          }
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-muted rounded-full p-6">
          <BookIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Không tìm thấy sách</h2>
          <p className="text-muted-foreground max-w-xs">Cuốn sách bạn tìm kiếm có thể đã bị gỡ bỏ hoặc không tồn tại.</p>
        </div>
        <Button onClick={() => router.push("/")} variant="secondary" className="rounded-full">
          Về trang chủ
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1.5 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground line-clamp-1 max-w-[200px] md:max-w-md">
            {book.title}
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Hero Section */}
      <div className="relative pt-8 pb-12 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={book.coverImageUrl || "/placeholder-book.png"}
            alt=""
            className="w-full h-[500px] object-cover opacity-15 blur-[100px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">
            {/* Book Cover */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="relative group w-[220px] md:w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-border transition-all duration-500 hover:border-primary/50">
                <img
                  src={book.coverImageUrl || "/placeholder-book.png"}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Book Meta */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {book.category && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                      {book.category.name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-sm">{book.averageRating?.toFixed(1) || "0.0"}</span>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground uppercase text-[10px]">
                    {book.language.toUpperCase()}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-foreground font-serif">
                  {book.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {book.authors?.map(a => a.name).join(", ") || "Unknown Author"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white px-8 rounded-full font-bold shadow-lg shadow-accent/20 h-12"
                  onClick={() => router.push(`/books/${book.id}/read`)}
                >
                  <Play className="mr-2 h-5 w-5 fill-current" /> Đọc ngay
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-border hover:bg-muted text-foreground px-8 rounded-full font-bold h-12"
                >
                  <Bookmark className="mr-2 h-5 w-5" /> Lưu sách
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
             <StatCard 
               icon={<Eye className="h-5 w-5 text-blue-500" />} 
               label="Lượt đọc" 
               value={book.totalReads?.toLocaleString() || "0"} 
             />
             <StatCard 
               icon={<MessageSquare className="h-5 w-5 text-emerald-500" />} 
               label="Đánh giá" 
               value={book.totalReviews?.toString() || "0"} 
             />
             <StatCard 
               icon={<Clock className="h-5 w-5 text-purple-500" />} 
               label="Xuất bản" 
               value={book.publishedYear?.toString() || "2024"} 
             />
             <StatCard 
               icon={<BookIcon className="h-5 w-5 text-orange-500" />} 
               label="Số trang" 
               value={`${book.pageCount || "???"}`} 
             />
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-transparent p-0 h-12">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-0 h-full font-bold text-sm"
                >
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger 
                   value="details" 
                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-0 h-full font-bold text-sm"
                >
                  Chi tiết
                </TabsTrigger>
                <TabsTrigger 
                   value="reviews" 
                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-0 h-full font-bold text-sm"
                >
                  Nhận xét
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="py-8 space-y-8 outline-none">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h3 className="text-xl font-bold text-foreground">Mô tả nội dung</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg font-light whitespace-pre-wrap">
                    {book.description || "Cuốn sách này hiện chưa có phần giới thiệu nội dung."}
                  </p>
                </div>

                {/* Reading Progress Component */}
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Tiến độ của bạn</p>
                        <p className="text-xs text-muted-foreground">Bạn đã hoàn thành 67%</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-full h-8 px-4" onClick={() => router.push(`/books/${book.id}/read`)}>
                      Tiếp tục
                    </Button>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="w-[67%] h-full bg-accent" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="py-8 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <DetailRow label="Nhà xuất bản" value={book.publisher} />
                  <DetailRow label="Năm phát hành" value={book.publishedYear?.toString()} />
                  <DetailRow label="Số trang" value={`${book.pageCount} trang`} />
                  <DetailRow label="ISBN" value={book.isbn} />
                  <DetailRow label="Ngôn ngữ" value={book.language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'} />
                  <DetailRow label="ID Sách" value={book.id.toString()} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Membership Promo */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-orange-600 text-white space-y-4 shadow-xl shadow-primary/20">
              <h4 className="text-xl font-bold leading-tight">Đọc không giới hạn với Premium</h4>
              <p className="text-white/80 text-xs leading-relaxed">Tiếp cận hàng ngàn cuốn sách bản quyền và tính năng đọc ngoại tuyến.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-full font-bold h-11">
                Nâng cấp ngay
              </Button>
            </div>

            {/* Similar Books */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Sách tương tự</h3>
              <div className="space-y-4">
                {similarBooks.length > 0 ? (
                  similarBooks.slice(0, 3).map(item => (
                    <div 
                      key={item.id} 
                      className="group flex gap-4 cursor-pointer items-center"
                      onClick={() => router.push(`/books/${item.id}`)}
                    >
                      <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-muted border border-border shadow-sm transition-transform group-hover:scale-105">
                        <img
                          src={item.coverImageUrl || "/placeholder-book.png"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.authors?.[0]?.name}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          {item.averageRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Đang tải sách tương tự...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Books Grid - Bottom */}
      <div className="container mx-auto px-6 py-16 border-t border-border">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold text-foreground">Khám phá thêm</h3>
          <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
            Tất cả <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {similarBooks.map(item => (
            <div 
              key={item.id} 
              className="group space-y-3 cursor-pointer"
              onClick={() => router.push(`/books/${item.id}`)}
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-border shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
                <img
                  src={item.coverImageUrl || "/placeholder-book.png"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {item.authors?.[0]?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm transition-all hover:border-primary/20">
      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
        <p className="text-base font-black text-foreground">{value}</p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-border/50 group">
      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>
      <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{value || "N/A"}</span>
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border bg-card/95" />
      <div className="container mx-auto px-6 pt-12 space-y-12">
        <div className="flex flex-col md:flex-row gap-10">
          <Skeleton className="w-[280px] aspect-[2/3] rounded-2xl bg-muted" />
          <div className="flex-1 space-y-6 py-4">
            <Skeleton className="h-6 w-32 rounded-full bg-muted" />
            <Skeleton className="h-16 w-3/4 bg-muted" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40 rounded-full bg-muted" />
              <Skeleton className="h-12 w-40 rounded-full bg-muted" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-20 rounded-2xl bg-muted" />
          <Skeleton className="h-20 rounded-2xl bg-muted" />
          <Skeleton className="h-20 rounded-2xl bg-muted" />
          <Skeleton className="h-20 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
