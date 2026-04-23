package com.devteria.book.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteria.book.dto.request.BookshelfRequest;
import com.devteria.book.dto.request.BookshelfSearchRequest;
import com.devteria.book.dto.response.BookshelfResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.entity.Book;
import com.devteria.book.entity.ReadingStatus;
import com.devteria.book.entity.UserBookShelf;
import com.devteria.book.exception.AppException;
import com.devteria.book.exception.ErrorCode;
import com.devteria.book.mapper.BookshelfMapper;
import com.devteria.book.repository.book.BookRepository;
import com.devteria.book.repository.bookshelf.UserBookShelfRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookshelfService {
    UserBookShelfRepository bookshelfRepository;
    BookRepository bookRepository;
    BookshelfMapper bookshelfMapper;
    HttpServletRequest request;

    @Transactional
    public BookshelfResponse addToShelf(BookshelfRequest shelfRequest) {
        String userId = request.getHeader("X-User-Id");
        if (userId == null) throw new AppException(ErrorCode.UNAUTHENTICATED);

        UUID userUuid = UUID.fromString(userId);

        // Check if already in shelf
        var existing = bookshelfRepository.findByUserIdAndBookId(userUuid, shelfRequest.getBookId());
        if (existing.isPresent()) {
            return updateShelf(existing.get().getId(), shelfRequest);
        }

        Book book = bookRepository
                .findById(shelfRequest.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        UserBookShelf shelf = bookshelfMapper.toUserBookShelf(shelfRequest);
        shelf.setUserId(userUuid);
        shelf.setBook(book);

        if (shelf.getStatus() == ReadingStatus.READING) {
            shelf.setStartedAt(LocalDate.now());
        } else if (shelf.getStatus() == ReadingStatus.READ) {
            shelf.setFinishedAt(LocalDate.now());
            shelf.setProgress(100);
        }

        shelf = bookshelfRepository.save(shelf);

        // Update Book Rating if rating provided
        if (shelfRequest.getRating() != null) {
            updateBookRating(book);
        }

        return bookshelfMapper.toBookshelfResponse(shelf);
    }

    public PageResponse<BookshelfResponse> getMyShelf(int page, int size, BookshelfSearchRequest criteria) {
        String userId = request.getHeader("X-User-Id");
        if (userId == null) throw new AppException(ErrorCode.UNAUTHENTICATED);

        UUID userUuid = UUID.fromString(userId);

        Sort sort = Sort.by("updatedAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = bookshelfRepository.searchMyShelf(userUuid, criteria, pageable);

        return PageResponse.<BookshelfResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(bookshelfMapper::toBookshelfResponse)
                        .toList())
                .build();
    }

    @Transactional
    public BookshelfResponse updateShelf(Long id, BookshelfRequest shelfRequest) {
        UserBookShelf shelf = bookshelfRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION)); // TODO: Add specific error

        bookshelfMapper.updateUserBookShelf(shelf, shelfRequest);

        if (shelf.getStatus() == ReadingStatus.READ && shelf.getFinishedAt() == null) {
            shelf.setFinishedAt(LocalDate.now());
            shelf.setProgress(100);
        }

        shelf = bookshelfRepository.save(shelf);

        if (shelfRequest.getRating() != null) {
            updateBookRating(shelf.getBook());
        }

        return bookshelfMapper.toBookshelfResponse(shelf);
    }

    @Transactional
    public void removeFromShelf(Long id) {
        UserBookShelf shelf =
                bookshelfRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));
        Book book = shelf.getBook();
        bookshelfRepository.deleteById(id);
        updateBookRating(book);
    }

    private void updateBookRating(Book book) {
        var allRatings = bookshelfRepository.findByBookIdWithRating(book.getId());
        long count = allRatings.size();
        int sum = allRatings.stream().mapToInt(UserBookShelf::getRating).sum();

        if (count > 0) {
            BigDecimal avg = BigDecimal.valueOf(sum).divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
            book.setAverageRating(avg);
            book.setTotalReviews((int) count);
        } else {
            book.setAverageRating(BigDecimal.ZERO);
            book.setTotalReviews(0);
        }
        bookRepository.save(book);
    }
}
