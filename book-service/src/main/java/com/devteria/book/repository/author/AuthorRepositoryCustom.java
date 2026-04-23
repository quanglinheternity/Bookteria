package com.devteria.book.repository.author;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.devteria.book.dto.request.AuthorSearchRequest;
import com.devteria.book.entity.Author;

public interface AuthorRepositoryCustom {
    Page<Author> searchAuthors(AuthorSearchRequest criteria, Pageable pageable);
}
