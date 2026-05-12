import { Book } from "./book.type"

export interface BookSize {
  width: number
  height: number
}

export interface ReaderConfig {
  aspectRatio: number
  padding: {
    desktop: { x: number; y: number }
    mobile: { x: number; y: number }
  }
  mobileBreakpoint: number
}

export interface BookReaderState {
  book: Book | null
  fileUrl: string | null
  isLoading: boolean
  location: string | number
  currentPage: number
  isDoublePage: boolean
  numPages: number
  bookSize: BookSize
  isPdf: boolean
  isEpub: boolean
}
