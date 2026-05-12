"use client"

import { useState, useEffect } from "react"

type ReaderTheme = "dark" | "light" | "sepia"

// Singleton state
let currentTheme: ReaderTheme = "light"
const listeners = new Set<(theme: ReaderTheme) => void>()

export function useReaderSettings() {
  const [theme, setThemeState] = useState<ReaderTheme>(currentTheme)

  useEffect(() => {
    const listener = (newTheme: ReaderTheme) => setThemeState(newTheme)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const setTheme = (newTheme: ReaderTheme) => {
    currentTheme = newTheme
    listeners.forEach(l => l(newTheme))
  }

  return { theme, setTheme }
}
