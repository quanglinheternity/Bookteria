package com.devteria.book.repository.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devteria.book.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, BookRepositoryCustom {
    Page<Book> findAll(Pageable pageable);

    boolean existsByIsbn(String isbn);
}
