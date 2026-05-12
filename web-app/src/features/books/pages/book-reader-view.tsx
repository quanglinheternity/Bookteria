"use client"

import { useState, useEffect, forwardRef } from "react"
import dynamic from "next/dynamic"
import {
  ChevronLeft,
  Settings,
  Maximize,
  Loader2,
  FileText,
  ChevronRight,
  Columns,
  Minus,
  Plus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useReaderSettings } from "@/hooks/use-reader-settings"
import { useBookReader } from "../hooks/use-book-reader"

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Dynamically import browser-only components
const ReactReader = dynamic(() => import("react-reader").then(mod => mod.ReactReader), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

const HTMLFlipBook = dynamic(() => import("react-pageflip").then(mod => mod.default), {
  ssr: false
})

const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false
})

// ForwardRef component for PDF Page - Optimized for full visibility
const PdfPage = forwardRef<HTMLDivElement, { pageNumber: number, width: number, height: number, theme: string, scale: number }>((props, ref) => {
  return (
    <div ref={ref} className={cn(
      "relative w-full h-full flex items-center justify-center transition-colors duration-500 overflow-hidden",
      props.theme === 'dark' ? "bg-[#1a1a1a]" : props.theme === 'sepia' ? "bg-[#fdfcf8]" : "bg-white"
    )}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply z-10"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }}
      />

      <div className={cn(
        "relative m-2 z-0 w-full h-full flex justify-center custom-scrollbar",
        props.scale > 1 ? "overflow-auto items-start pt-10" : "overflow-hidden items-center"
      )}>
        <div style={{ width: props.width * props.scale, height: props.height * props.scale }} className=" transition-all duration-300">
          <Page
            pageNumber={props.pageNumber}
            width={props.width}
            scale={props.scale}
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className={cn(
              "flex items-center justify-center shadow-sm transition-all duration-500",
              props.theme === 'dark' && "invert hue-rotate-180 brightness-90 contrast-110"
            )}
            loading={<Loader2 className="h-6 w-6 animate-spin opacity-10" />}
          />
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-20" />
    </div>
  )
})

PdfPage.displayName = 'PdfPage'

export function BookReaderView() {
  const { theme, setTheme } = useReaderSettings()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)

  const {
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
  } = useBookReader()

  // ESC key to show controls
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsControlsVisible(true)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  if (isLoading) return <LoadingSpinner />

  if (!fileUrl) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-6">
        <div className="bg-muted rounded-full p-6 text-accent">
          <FileText className="h-12 w-12" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Không thể tải tệp sách</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">Vui lòng kiểm tra lại quyền truy cập hoặc định dạng tệp tin.</p>
        </div>
        <Button onClick={() => router.back()} variant="secondary" className="rounded-full px-8">
          Quay lại
        </Button>
      </div>
    )
  }

  const themeStyles = {
    dark: {
      body: { background: "#000 !important", color: "#e5e5e5 !important", fontFamily: "serif !important", textAlign: "justify !important" },
      reader: { background: "#000" }
    },
    light: {
      body: { background: "#fff !important", color: "#1a1a1a !important", fontFamily: "serif !important", textAlign: "justify !important" },
      reader: { background: "#fff" }
    },
    sepia: {
      body: { background: "#fdfcf8 !important", color: "#3a2d26 !important", fontFamily: "serif !important", textAlign: "justify !important" },
      reader: { background: "#fdfcf8" }
    }
  }

  const Reader: any = ReactReader;
  const FlipBook: any = HTMLFlipBook;

  return (
    <div className={cn(
      "h-screen w-full transition-colors duration-700 flex flex-col overflow-hidden select-none relative",
      theme === "dark" ? "bg-black text-white" : theme === "sepia" ? "bg-[#fdfcf8] text-[#3a2d26]" : "bg-white text-black"
    )}>
      <div className={cn(
        "absolute inset-0 z-0 opacity-10 blur-[100px] pointer-events-none",
        theme === 'dark' ? "bg-white" : "bg-black"
      )} />


      {/* Main Reading Container - Background clicks toggle UI */}
      <div
        ref={readerContainerRef}
        onClick={() => setIsControlsVisible(!isControlsVisible)}
        className="flex-1 relative pt-24 pb-8 group flex items-center justify-center overflow-hidden z-10 p-0 cursor-default"
      >
        {/* Friendly Floating Top Header - Absolute to this container */}
        <div className={cn(
          "absolute top-1 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl h-16 flex items-center justify-between px-6 transition-all duration-700",
          "rounded-2xl border shadow-xl backdrop-blur-2xl",
          theme === 'dark' ? "bg-black/60 border-white/10 shadow-white/5" : theme === 'sepia' ? "bg-[#fdfcf8]/80 border-[#3a2d26]/10 shadow-[#3a2d26]/5" : "bg-white/80 border-black/10 shadow-black/5",
          !isControlsVisible ? "-translate-y-32 opacity-0" : "translate-y-0 opacity-100"
        )}>
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/books/${book?.id}`)}
              className="rounded-xl hover:bg-current/10 h-10 w-10 transition-transform active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold font-serif truncate max-w-[150px] md:max-w-xs">{book?.title}</h1>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-current opacity-30" />
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-medium">Đang đọc</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-current/5">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={cn(
                "w-85 border-l p-8 transition-colors duration-700 shadow-2xl",
                theme === 'dark' ? "bg-black border-white/10 text-white" : theme === 'sepia' ? "bg-[#fdfcf8] border-[#3a2d26]/10 text-[#3a2d26]" : "bg-white border-black/10 text-black"
              )}>
                <SheetHeader className="mb-10">
                  <SheetTitle className="text-2xl font-serif">Cài đặt đọc</SheetTitle>
                </SheetHeader>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Màu giấy</label>
                    <div className="grid grid-cols-3 gap-4">
                      <ThemeButton active={theme === "light"} onClick={() => setTheme("light")} label="Sáng" colorClass="bg-white border-gray-200" />
                      <ThemeButton active={theme === "sepia"} onClick={() => setTheme("sepia")} label="Ngà" colorClass="bg-[#fdfcf8] border-[#3a2d26]/20" />
                      <ThemeButton active={theme === "dark"} onClick={() => setTheme("dark")} label="Tối" colorClass="bg-[#1a1a1a] border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Phóng to nội dung</label>
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-current/5 border border-current/10">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                          className="h-8 w-8 rounded-full border border-current/20"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-serif min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setScale(Math.min(2.5, scale + 0.1))}
                          className="h-8 w-8 rounded-full border border-current/20"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScale(1.0)}
                        className="rounded-full h-8 px-4 text-[10px] font-serif"
                      >
                        Mặc định
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Bố cục</label>
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-current/5 border border-current/10">
                      <div className="flex items-center gap-4">
                        <Columns className="h-5 w-5 opacity-60" />
                        <span className="text-sm font-serif">Chế độ hai trang</span>
                      </div>
                      <Button size="sm" variant={isDoublePage ? "default" : "outline"} onClick={() => setIsDoublePage(!isDoublePage)} className={cn("rounded-full h-9 px-6 font-serif", isDoublePage && "bg-black text-white dark:bg-white dark:text-black")}>
                        {isDoublePage ? "Bật" : "Tắt"}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-current/5" onClick={() => setIsControlsVisible(!isControlsVisible)}>
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Book Wrapper - Clicks here turn pages and don't toggle UI */}
        <div
          className="relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {isEpub ? (
            <div className="h-[calc(100vh-140px)] w-full max-w-[98vw] mx-auto rounded-sm shadow-2xl overflow-hidden ring-1 ring-current/5 flex items-center justify-center">
              {fileUrl ? (
                <Reader
                  url={fileUrl}
                  location={location}
                  locationChanged={(loc: string) => setLocation(loc)}
                  epubOptions={{
                    flow: "paginated", width: "100%", height: "100%", manager: "default",
                    spread: isDoublePage ? "auto" : "none",
                    allowScriptedContent: true
                  }}
                  iframeProps={{
                    sandbox: "allow-scripts allow-same-origin allow-popups",
                  }}
                  readerStyles={{
                    container: { ...themeStyles[theme].reader, padding: "32px 48px" },
                    reader: { ...themeStyles[theme].reader },
                    tocArea: { background: themeStyles[theme].reader.background }
                  }}
                  epubInitOptions={{ openAs: "epub" }}
                  getRendition={(rendition: any) => {
                    renditionRef.current = rendition
                    rendition.themes.register("custom", themeStyles[theme]);
                    rendition.themes.select("custom");
                    rendition.themes.fontSize(`110%`);
                    rendition.themes.default({
                      'p': { 'text-indent': '1.5em', 'margin-bottom': '1em', 'line-height': '1.8', 'text-align': 'justify' },
                      'body': { 'font-family': 'Georgia, serif !important', 'font-size': '18px !important' }
                    });
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-40 text-current">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-serif italic">Đang tải nội dung sách...</p>
                </div>
              )}
            </div>
          ) : isPdf ? (
            <div className="h-full w-full flex items-center justify-center">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<LoadingSpinner />}
                className="h-full w-full flex items-center justify-center"
              >
                {numPages > 0 && (
                  <FlipBook
                    width={bookSize.width}
                    height={bookSize.height}
                    size="fixed"
                    minWidth={400}
                    maxWidth={4000}
                    minHeight={600}
                    maxHeight={4000}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={!isDoublePage}
                    startPage={0}
                    showCover={true}
                    mobileScrollSupport={true}
                    ref={flipBookRef}
                    onFlip={onFlip}
                    className="shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                    startZIndex={0} autoSize={true} maxShadowOpacity={0.4} clickEventForward={true} useMouseEvents={true}
                    swipeDistance={30} showPageCorners={true} disableFlipByClick={false}
                  >
                    {Array.from({ length: numPages }, (_, i) => (
                      <PdfPage
                        key={i}
                        pageNumber={i + 1}
                        width={bookSize.width}
                        height={bookSize.height}
                        theme={theme}
                        scale={scale}
                      />
                    ))}
                  </FlipBook>
                )}
              </Document>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground italic font-serif">
              Định dạng tệp không hỗ trợ xem trực tiếp.
            </div>
          )}
        </div>

        {/* Subtle Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center z-30 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-500 pointer-events-auto",
              isControlsVisible ? "opacity-100 translate-x-4" : "opacity-0 -translate-x-4"
            )}
            onClick={prevPage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center z-30 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-500 pointer-events-auto",
              isControlsVisible ? "opacity-100 -translate-x-4" : "opacity-0 translate-x-4"
            )}
            onClick={nextPage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Simplified Centered Progress Indicator - Absolute to this container */}
        {isControlsVisible && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={cn(
              "px-6 py-2.5 rounded-full backdrop-blur-xl border shadow-2xl flex items-center gap-3",
              theme === 'dark' ? "bg-black/40 border-white/10" : theme === 'sepia' ? "bg-[#fdfcf8]/40 border-[#3a2d26]/10" : "bg-white/40 border-black/10"
            )}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                Trang {currentPage} / {numPages}
              </span>
            </div>
          </div>
        )}
      </div>


      {/* Subtle Restore Button (Only visible when controls are hidden) */}
      {!isControlsVisible && (
        <div className="fixed top-4 right-4 z-[60] animate-in fade-in duration-1000">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsControlsVisible(true)}
            className="rounded-full bg-current/5 hover:bg-current/20 backdrop-blur-md opacity-20 hover:opacity-100 transition-all"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      )}

    </div>
  )
}

function ThemeButton({ active, onClick, label, colorClass }: any) {
  return (
    <button onClick={onClick} className={cn(
      "flex items-center justify-center h-14 rounded-xl border-2 transition-all duration-500",
      active ? "border-black dark:border-white scale-105" : "border-transparent opacity-60 hover:opacity-100",
      colorClass
    )}>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}

function LoadingSpinner() {
  return (
    <div className="h-screen w-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-current/10 border-t-current animate-spin" />
        <p className="text-xs font-serif italic opacity-40">Đang chuẩn bị sách...</p>
      </div>
    </div>
  )
}
