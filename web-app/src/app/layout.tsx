import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import "./globals.css"

const _inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" })
const _playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "VPS - Vietnam Photo Scout",
  description:
    "Discover and share the most beautiful photo spots across Vietnam. A social network for photographers.",
}

export const viewport: Viewport = {
  themeColor: "#d97706",
  width: "device-width",
  initialScale: 1,
}

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${_inter.variable} ${_playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
