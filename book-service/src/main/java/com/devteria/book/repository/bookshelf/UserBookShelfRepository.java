package com.devteria.book.repository.bookshelf;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import com.devteria.book.entity.UserBookShelf;

@Repository
public interface UserBookShelfRepository
        extends JpaRepository<UserBookShelf, Long>,
                QuerydslPredicateExecutor<UserBookShelf>,
                UserBookShelfRepositoryCustom {
    Optional<UserBookShelf> findByUserIdAndBookId(UUID userId, Long bookId);
}
