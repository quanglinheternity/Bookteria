import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { bookService } from "../services/book.service"
import { Book } from "../types/book.type"
import { BookSize } from "../types/reader.types"

export const CONFIG = {
  aspectRatio: 1.41,
  padding: {
    desktop: { x: 140, y: 100 },
    mobile: { x: 40, y: 60 }
  },
  mobileBreakpoint: 768
}

export function useBookReader() {
  const { id } = useParams()
  const router = useRouter()

  const [book, setBook] = useState<Book | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState<string | number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDoublePage, setIsDoublePage] = useState(true)
  const [numPages, setNumPages] = useState<number>(0)
  const [bookSize, setBookSize] = useState<BookSize>({ width: 450, height: 635 })
  const [scale, setScale] = useState(1.0)

  const fileUrlRef = useRef<string | null>(null)
  const renditionRef = useRef<any>(null)
  const flipBookRef = useRef<any>(null)
  const readerContainerRef = useRef<HTMLDivElement>(null)

  // PDF Worker Setup
  useEffect(() => {
    const setupPdfWorker = async () => {
      const pdfjs = await import('react-pdf').then(mod => mod.pdfjs)
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    }
    setupPdfWorker()
  }, [])

  // Data Fetching
  useEffect(() => {
    const fetchBookAndFile = async () => {
      if (!id) return
      try {
        const response = await bookService.getBookDetail(parseInt(id as string))
        if (response.code === 1000) {
          const bookData = response.result
          setBook(bookData)

          if (bookData.bookFileUrl) {
            const fileName = bookData.bookFileUrl.split('/').pop()
            if (fileName) {
              const fileBlob = await bookService.getBookFile(fileName)
              const url = URL.createObjectURL(fileBlob)
              setFileUrl(url)
              fileUrlRef.current = url
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch book or file:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookAndFile()

    return () => {
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current)
      }
    }
  }, [id])

  // Responsive Sizing logic
  useEffect(() => {
    const updateDimensions = () => {
      if (readerContainerRef.current) {
        const { offsetWidth: ow, offsetHeight: oh } = readerContainerRef.current
        const pad = isDoublePage ? CONFIG.padding.desktop : CONFIG.padding.mobile

        const aw = ow - pad.x
        const ah = oh - pad.y

        let w, h

        if (isDoublePage) {
          w = Math.min(aw / 2, ah / CONFIG.aspectRatio)
          h = w * CONFIG.aspectRatio
        } else {
          w = Math.min(aw, ah / CONFIG.aspectRatio)
          h = w * CONFIG.aspectRatio

          if (h < ah * 0.7 && ah > aw) {
            h = ah - 60
            w = h / CONFIG.aspectRatio
            if (w > aw) {
              w = aw
              h = w * CONFIG.aspectRatio
            }
          }
        }

        setBookSize({ width: Math.floor(w), height: Math.floor(h) })
      }
    }

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateDimensions)
    })

    if (readerContainerRef.current) {
      observer.observe(readerContainerRef.current)
    }

    updateDimensions()

    return () => observer.disconnect()
  }, [isDoublePage])

  // Mobile layout detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < CONFIG.mobileBreakpoint
      if (isMobile && isDoublePage) {
        setIsDoublePage(false)
      } else if (!isMobile && !isDoublePage) {
        setIsDoublePage(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isDoublePage])

  const isEpub = book?.bookFileUrl?.toLowerCase().endsWith(".epub") || book?.title?.toLowerCase().includes("epub")
  const isPdf = book?.bookFileUrl?.toLowerCase().endsWith(".pdf") || (!isEpub && !!book)

  const prevPage = () => {
    if (isEpub && renditionRef.current) {
      renditionRef.current.prev()
    } else if (isPdf && flipBookRef.current) {
      (flipBookRef.current as any).pageFlip().flipPrev()
    }
  }

  const nextPage = () => {
    if (isEpub && renditionRef.current) {
      renditionRef.current.next()
    } else if (isPdf && flipBookRef.current) {
      (flipBookRef.current as any).pageFlip().flipNext()
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const onFlip = (e: any) => {
    setCurrentPage(e.data + 1)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextPage()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        prevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextPage, prevPage])

  return {
    book,
    fileUrl,
    isLoading,
    location,
    setLocation,
    currentPage,
    numPages,
    bookSize,
    isDoublePage,
    setIsDoublePage,
    isEpub,
    isPdf,
    readerContainerRef,
    flipBookRef,
    renditionRef,
    prevPage,
    nextPage,
    onDocumentLoadSuccess,
    onFlip,
    scale,
    setScale,
    router
  }
}
