package com.devteria.book.repository.book;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.devteria.book.dto.request.BookSearchRequest;
import com.devteria.book.entity.Book;
import com.devteria.book.entity.QAuthor;
import com.devteria.book.entity.QBook;
import com.devteria.book.entity.QCategory;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookRepositoryCustomImpl implements BookRepositoryCustom {
    JPAQueryFactory queryFactory;

    QBook book = QBook.book;
    QCategory category = QCategory.category;
    QAuthor author = QAuthor.author;

    @Override
    public Page<Book> searchBooks(BookSearchRequest criteria, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();

        if (criteria.getKeyword() != null && !criteria.getKeyword().isBlank()) {
            builder.and(book.title
                    .containsIgnoreCase(criteria.getKeyword())
                    .or(book.isbn.eq(criteria.getKeyword()))
                    .or(book.authors.any().name.containsIgnoreCase(criteria.getKeyword())));
        }

        if (criteria.getCategoryId() != null) {
            builder.and(book.category.id.eq(criteria.getCategoryId()));
        }

        if (criteria.getAuthorId() != null) {
            builder.and(book.authors.any().id.eq(criteria.getAuthorId()));
        }

        if (criteria.getMinYear() != null) {
            builder.and(book.publishedYear.goe(criteria.getMinYear()));
        }

        if (criteria.getMaxYear() != null) {
            builder.and(book.publishedYear.loe(criteria.getMaxYear()));
        }

        if (criteria.getLanguage() != null && !criteria.getLanguage().isBlank()) {
            builder.and(book.language.eq(criteria.getLanguage()));
        }

        List<Book> books = queryFactory
                .selectFrom(book)
                .leftJoin(book.category, category)
                .fetchJoin()
                .leftJoin(book.authors, author)
                .fetchJoin()
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory.select(book.count()).from(book).where(builder).fetchOne();

        return new PageImpl<>(books, pageable, total != null ? total : 0);
    }

    @Override
    public List<Book> findNewBooks(int limit) {
        return queryFactory
                .selectFrom(book)
                .leftJoin(book.category, category)
                .fetchJoin()
                .leftJoin(book.authors, author)
                .fetchJoin()
                .orderBy(book.createdAt.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Book> findRelatedBooks(Long bookId, Long categoryId, int limit) {
        return queryFactory
                .selectFrom(book)
                .leftJoin(book.category, category)
                .fetchJoin()
                .leftJoin(book.authors, author)
                .fetchJoin()
                .where(book.category.id.eq(categoryId).and(book.id.ne(bookId)))
                .orderBy(book.averageRating.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public Optional<Book> findByIdWithDetails(Long id) {
        Book result = queryFactory
                .selectFrom(book)
                .leftJoin(book.category, category)
                .fetchJoin()
                .leftJoin(book.authors, author)
                .fetchJoin()
                .where(book.id.eq(id))
                .fetchOne();
        return Optional.ofNullable(result);
    }
}
