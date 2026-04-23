package com.devteria.book.service;

import java.util.HashSet;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.devteria.book.dto.request.BookCreationRequest;
import com.devteria.book.dto.request.BookSearchRequest;
import com.devteria.book.dto.request.BookUpdateRequest;
import com.devteria.book.dto.response.BookResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.entity.Book;
import com.devteria.book.exception.AppException;
import com.devteria.book.exception.ErrorCode;
import com.devteria.book.mapper.BookMapper;
import com.devteria.book.repository.author.AuthorRepository;
import com.devteria.book.repository.book.BookRepository;
import com.devteria.book.repository.category.CategoryRepository;
import com.devteria.book.repository.httpclient.FileClient;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookService {
    BookRepository bookRepository;
    CategoryRepository categoryRepository;
    AuthorRepository authorRepository;
    BookMapper bookMapper;
    FileClient fileClient;
    HttpServletRequest request;

    public BookResponse create(BookCreationRequest creationRequest) {
        if (bookRepository.existsByIsbn(creationRequest.getIsbn())) {
            throw new AppException(ErrorCode.BOOK_EXISTED);
        }

        Book book = bookMapper.toBook(creationRequest);

        // Map Category
        if (creationRequest.getCategoryId() != null) {
            book.setCategory(categoryRepository
                    .findById(creationRequest.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        }

        // Map Authors
        if (creationRequest.getAuthorIds() != null
                && !creationRequest.getAuthorIds().isEmpty()) {
            book.setAuthors(new HashSet<>(authorRepository.findAllById(creationRequest.getAuthorIds())));
        }

        // Handle Image
        if (creationRequest.getCoverImage() != null) {
            var response = fileClient.uploadMedia(creationRequest.getCoverImage());
            book.setCoverImageUrl(response.getResult().getUrl());
        }

        // Handle Book File
        if (creationRequest.getBookFile() != null) {
            var response = fileClient.uploadMedia(creationRequest.getBookFile());
            book.setBookFileUrl(response.getResult().getUrl());
        }

        // Set CreatedBy from X-User-Id Header
        String userId = request.getHeader("X-User-Id");
        log.info("userId, {}", userId);
        if (userId != null) {
            book.setCreatedBy(UUID.fromString(userId));
        }

        return bookMapper.toBookResponse(bookRepository.save(book));
    }

    public PageResponse<BookResponse> searchBooks(int page, int size, BookSearchRequest criteria) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = bookRepository.searchBooks(criteria, pageable);

        return PageResponse.<BookResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(bookMapper::toBookResponse)
                        .toList())
                .build();
    }

    public BookResponse getById(Long id) {
        return bookRepository
                .findByIdWithDetails(id)
                .map(bookMapper::toBookResponse)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
    }

    public BookResponse update(Long id, BookUpdateRequest request) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        bookMapper.updateBook(book, request);

        if (request.getCategoryId() != null) {
            book.setCategory(categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        }

        if (request.getAuthorIds() != null) {
            book.setAuthors(new HashSet<>(authorRepository.findAllById(request.getAuthorIds())));
        }

        if (request.getCoverImage() != null) {
            var response = fileClient.uploadMedia(request.getCoverImage());
            book.setCoverImageUrl(response.getResult().getUrl());
        }

        if (request.getBookFile() != null) {
            var response = fileClient.uploadMedia(request.getBookFile());
            book.setBookFileUrl(response.getResult().getUrl());
        }

        return bookMapper.toBookResponse(bookRepository.save(book));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        bookRepository.deleteById(id);
    }
}
