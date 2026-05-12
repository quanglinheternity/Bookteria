"use client"

import { useState } from "react"
import { usePosts } from "../hooks/usePosts"
import { usePostActions } from "../hooks/usePostActions"
import { AdminPostListTable } from "./admin-post-list-table"
import { PostResponse } from "../types/post.type"
import { PostDetailDialog } from "./PostDetailDialog"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Loader2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminPostsView() {
  // Pass undefined for userId to fetch all posts
  const { posts, isLoading, pagination, handlePageChange, refresh } = usePosts(undefined, 1, 10)
  const { deletePost } = usePostActions()
  
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleView = (post: PostResponse) => {
    setSelectedPost(post)
    setIsDetailOpen(true)
  }

  const handleDelete = async (postId: string) => {
    const success = await deletePost(postId)
    if (success) {
      refresh() // Refresh the list after successful deletion
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif text-foreground">Quản lý bài viết</h1>
          <p className="text-muted-foreground mt-1">
            Xem, quản lý và kiểm duyệt các bài viết trên hệ thống.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refresh()} title="Làm mới">
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> 
            Làm mới
          </Button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <AdminPostListTable 
          posts={posts} 
          onView={handleView} 
          onDelete={handleDelete} 
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
              // Simple pagination logic for admin
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === pagination.currentPage}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              if (page === 2 || page === pagination.totalPages - 1) {
                return <PaginationItem key={page}><span className="px-2 text-muted-foreground">...</span></PaginationItem>
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </div>
  )
}
