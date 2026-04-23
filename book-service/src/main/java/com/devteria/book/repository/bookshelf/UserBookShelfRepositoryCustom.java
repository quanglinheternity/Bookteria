package com.devteria.book.repository.bookshelf;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.devteria.book.dto.request.BookshelfSearchRequest;
import com.devteria.book.entity.UserBookShelf;

public interface UserBookShelfRepositoryCustom {
    Page<UserBookShelf> searchMyShelf(UUID userId, BookshelfSearchRequest criteria, Pageable pageable);

    List<UserBookShelf> findByBookIdWithRating(Long bookId);
}
