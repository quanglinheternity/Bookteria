import { POSTS, COMMENTS } from "@/lib/mock-data"
import { PostDetailView } from "@/features/posts/components/post-detail-view"
import { notFound } from "next/navigation"

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = POSTS.find((p) => p.id === id)
  if (!post) notFound()

  return <PostDetailView post={post} comments={COMMENTS} />
}
