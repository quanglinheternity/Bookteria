"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Sun } from "lucide-react"
import { LOCATIONS, getPostsByLocation } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export function ExploreLocationsView() {
  const hotLocations = LOCATIONS.filter(
    (l) => l.level === "landmark" || l.level === "district"
  ).sort((a, b) => {
    const aPostCount = getPostsByLocation(a.id, false).length
    const bPostCount = getPostsByLocation(b.id, false).length
    return bPostCount - aPostCount
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">Khám Phá Địa Điểm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm các địa điểm hot và cộng đồng tại mỗi nơi
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hotLocations.map((location) => {
            const posts = getPostsByLocation(location.id, false)
            const postCount = posts.length
            const previewImage = posts[0]?.images[0]

            return (
              <Link
                key={location.id}
                href={`/location/${location.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary"
              >
                {/* Image or Color Background */}
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={location.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="h-12 w-12 text-white/50" />
                    </div>
                  )}

                  {/* Post Count Badge */}
                  {postCount > 0 && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white">
                      {postCount} {postCount === 1 ? "bài" : "bài"}
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Info Section */}
                <div className="relative p-4">
                  <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                    {location.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {location.category}
                    </Badge>
                  </div>

                  <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                    {location.address}
                  </p>

                  {/* Stats */}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{location.province}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sun className="h-3 w-3" />
                      <span>6h30 tối</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {hotLocations.length === 0 && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold text-foreground">Chưa có địa điểm nào</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy thêm địa điểm của bạn để bắt đầu
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
