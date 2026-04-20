"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Camera,
  ChevronRight,
  X,
  Layers,
  Navigation,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPostsByLocation, type Location } from "@/lib/mock-data"
import { VietMapView } from "./vietmap"

type SelectedLocation = Location & {
  postCount: number
  previewImage: string
}

export function MapView() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null)

  const locationPosts = selectedLocation
    ? getPostsByLocation(selectedLocation.id, false)
    : []

  const handleViewInFeed = () => {
    if (selectedLocation) {
      router.push(`/?location=${selectedLocation.id}`)
    }
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="z-10 flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Photo Map</h1>
          <Badge
            variant="secondary"
            className="text-xs text-muted-foreground"
          >
            5 locations
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent text-xs"
          >
            <Layers className="h-3.5 w-3.5" />
            Layers
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent text-xs"
          >
            <Navigation className="h-3.5 w-3.5" />
            My Location
          </Button>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative flex-1">
        <VietMapView
          onSelectLocation={setSelectedLocation}
          selectedLocationId={selectedLocation?.id}
        />

        {/* Location Detail Panel */}
        {selectedLocation && (
          <div className="absolute bottom-6 left-6 right-6 z-20 max-w-lg">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex gap-4 p-4">
                {/* Preview Image */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={selectedLocation.previewImage || "/placeholder.svg"}
                    alt={selectedLocation.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="secondary"
                      className="shrink-0 bg-primary/10 text-[10px] text-primary"
                    >
                      {selectedLocation.category}
                    </Badge>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-foreground">
                    {selectedLocation.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedLocation.address}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Camera className="h-3.5 w-3.5" />
                      {selectedLocation.postCount} posts
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedLocation.province}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="border-t border-border px-4 py-3">
                <Button
                  onClick={handleViewInFeed}
                  className="w-full gap-2"
                  size="sm"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  View Posts in Feed
                  <ExternalLink className="ml-auto h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Related Posts */}
              {locationPosts.length > 0 && (
                <div className="border-t border-border px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Recent Photos
                    </p>
                    <Link
                      href={`/explore?location=${selectedLocation.id}`}
                      className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
                    >
                      View all
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {locationPosts.slice(0, 4).flatMap((post) =>
                      post.images.slice(0, 1).map((img, i) => (
                        <Link
                          key={`${post.id}-${i}`}
                          href={`/post/${post.id}`}
                          className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-md"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Photo at ${selectedLocation.name}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                            sizes="64px"
                          />
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
