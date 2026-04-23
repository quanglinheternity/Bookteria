package com.devteria.book.repository.bookshelf;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.devteria.book.dto.request.BookshelfSearchRequest;
import com.devteria.book.entity.QAuthor;
import com.devteria.book.entity.QBook;
import com.devteria.book.entity.QCategory;
import com.devteria.book.entity.QUserBookShelf;
import com.devteria.book.entity.UserBookShelf;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserBookShelfRepositoryCustomImpl implements UserBookShelfRepositoryCustom {
    JPAQueryFactory queryFactory;

    QUserBookShelf qShelf = QUserBookShelf.userBookShelf;
    QBook qBook = QBook.book;
    QCategory qCategory = QCategory.category;
    QAuthor qAuthor = QAuthor.author;

    @Override
    public Page<UserBookShelf> searchMyShelf(UUID userId, BookshelfSearchRequest criteria, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qShelf.userId.eq(userId));

        if (criteria.getStatus() != null) {
            builder.and(qShelf.status.eq(criteria.getStatus()));
        }

        if (criteria.getKeyword() != null && !criteria.getKeyword().isBlank()) {
            builder.and(qBook.title
                    .containsIgnoreCase(criteria.getKeyword())
                    .or(qAuthor.name.containsIgnoreCase(criteria.getKeyword())));
        }

        List<UserBookShelf> contents = queryFactory
                .selectFrom(qShelf)
                .leftJoin(qShelf.book, qBook)
                .fetchJoin()
                .leftJoin(qBook.category, qCategory)
                .fetchJoin()
                .leftJoin(qBook.authors, qAuthor)
                .fetchJoin()
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(qShelf.updatedAt.desc())
                .fetch();

        Long total =
                queryFactory.select(qShelf.count()).from(qShelf).where(builder).fetchOne();

        return new PageImpl<>(contents, pageable, total != null ? total : 0);
    }

    @Override
    public List<UserBookShelf> findByBookIdWithRating(Long bookId) {
        return queryFactory
                .selectFrom(qShelf)
                .where(qShelf.book.id.eq(bookId).and(qShelf.rating.isNotNull()))
                .fetch();
    }
}
