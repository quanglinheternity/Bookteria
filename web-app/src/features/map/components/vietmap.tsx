"use client"

import { useEffect, useRef, useState } from "react"
import { POSTS, LOCATIONS, type Location, getPostsByLocation } from "@/lib/mock-data"

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY || ""

// Get only landmark locations (deepest level) with post counts
const ALL_LOCATIONS: (Location & { postCount: number; previewImage: string })[] = (() => {
  const locMap = new Map<string, Location & { postCount: number; previewImage: string }>()
  
  // Get all landmark-level locations
  const landmarks = LOCATIONS.filter(l => l.level === "landmark")
  
  for (const landmark of landmarks) {
    const posts = getPostsByLocation(landmark.id, false)
    locMap.set(landmark.id, {
      ...landmark,
      postCount: posts.length,
      previewImage: posts[0]?.images[0] || "",
    })
  }
  
  return Array.from(locMap.values())
})()

interface VietMapProps {
  onSelectLocation?: (location: (typeof ALL_LOCATIONS)[number] | null) => void
  selectedLocationId?: string | null
}

export function VietMapView({ onSelectLocation, selectedLocationId }: VietMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load VietMap GL JS script
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already loaded
    if ((window as Record<string, unknown>).vietmapgl) {
      setScriptLoaded(true)
      return
    }

    // Load CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css"
    document.head.appendChild(link)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js"
    script.onload = () => setScriptLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!scriptLoaded || !mapContainer.current || mapRef.current) return

    const vietmapgl = (window as Record<string, unknown>).vietmapgl as Record<string, unknown>
    if (!vietmapgl) return

    const MapClass = vietmapgl.Map as new (options: Record<string, unknown>) => Record<string, unknown>
    const MarkerClass = vietmapgl.Marker as new (options?: Record<string, unknown>) => Record<string, (...args: unknown[]) => unknown>
    const PopupClass = vietmapgl.Popup as new (options?: Record<string, unknown>) => Record<string, (...args: unknown[]) => unknown>

    if (!VIETMAP_API_KEY) {
      setMapLoaded(true)
      return
    }

    const map = new MapClass({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_API_KEY}`,
      center: [106.6297, 16.0544],
      zoom: 5.2,
    }) as Record<string, (...args: unknown[]) => unknown>

    mapRef.current = map

    map.on("load", () => {
      setMapLoaded(true)

      // Add markers for each location
      ALL_LOCATIONS.forEach((loc) => {
        const el = document.createElement("div")
        el.className = "vietmap-custom-marker"
        el.innerHTML = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 40px; height: 40px;
              background: hsl(28, 80%, 52%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: transform 0.2s;
            ">
              <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            ${loc.postCount > 0 ? `
              <div style="
                position: absolute;
                background: hsl(28, 100%, 50%);
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                border: 2px solid white;
                bottom: -8px;
                right: -8px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              ">
                ${loc.postCount}
              </div>
            ` : ''}
          </div>
        `
        el.addEventListener("mouseenter", () => {
          const inner = el.firstElementChild as HTMLElement
          if (inner) inner.style.transform = "rotate(-45deg) scale(1.15)"
        })
        el.addEventListener("mouseleave", () => {
          const inner = el.firstElementChild as HTMLElement
          if (inner) inner.style.transform = "rotate(-45deg)"
        })
        el.addEventListener("click", () => {
          onSelectLocation?.(loc)
        })

        const popup = new PopupClass({ offset: 25, closeButton: false })
        popup.setHTML(`
          <div style="padding: 4px 8px; font-family: system-ui; font-size: 13px; font-weight: 600;">
            ${loc.name}
          </div>
        `)

        new MarkerClass({ element: el })
          .setLngLat([loc.longitude, loc.latitude])
          .setPopup(popup)
          .addTo(map)
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded])

  // Fly to selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocationId) return

    const loc = ALL_LOCATIONS.find((l) => l.id === selectedLocationId)
    if (!loc) return

    const map = mapRef.current as Record<string, (...args: unknown[]) => void>
    map.flyTo({
      center: [loc.longitude, loc.latitude],
      zoom: 14,
      duration: 1500,
    })
  }, [selectedLocationId])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {mapLoaded && !VIETMAP_API_KEY && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
          <div className="mx-auto max-w-md rounded-xl bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <title>Map icon</title>
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16" />
                <path d="M16 6v16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              VietMap API Key Required
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Add your VietMap API key as{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                NEXT_PUBLIC_VIETMAP_API_KEY
              </code>{" "}
              in environment variables to enable the interactive map.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Get your key at{" "}
              <a
                href="https://maps.vietmap.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                maps.vietmap.vn
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
