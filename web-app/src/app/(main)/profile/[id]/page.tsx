import { POSTS, getUserById } from "@/lib/mock-data"
import { ProfileView } from "@/features/profile/components/profile-view"
import { notFound } from "next/navigation"

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = getUserById(id)
  if (!user) notFound()

  return <ProfileView user={user} posts={POSTS} showBackButton />
}
