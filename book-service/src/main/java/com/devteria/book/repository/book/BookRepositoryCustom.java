package com.devteria.book.repository.book;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.devteria.book.dto.request.BookSearchRequest;
import com.devteria.book.entity.Book;

public interface BookRepositoryCustom {
    Page<Book> searchBooks(BookSearchRequest criteria, Pageable pageable);

    List<Book> findNewBooks(int limit);

    List<Book> findRelatedBooks(Long bookId, Long categoryId, int limit);

    Optional<Book> findByIdWithDetails(Long id);
}
