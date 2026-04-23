package com.devteria.book.repository.author;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.devteria.book.dto.request.AuthorSearchRequest;
import com.devteria.book.entity.Author;
import com.devteria.book.entity.QAuthor;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AuthorRepositoryCustomImpl implements AuthorRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Author> searchAuthors(AuthorSearchRequest criteria, Pageable pageable) {
        QAuthor qAuthor = QAuthor.author;
        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(criteria.getKeyword())) {
            String keyword = criteria.getKeyword().toLowerCase();
            builder.and(qAuthor.name
                    .toLowerCase()
                    .contains(keyword)
                    .or(qAuthor.bio.toLowerCase().contains(keyword))
                    .or(qAuthor.nationality.toLowerCase().contains(keyword)));
        }

        JPAQuery<Author> query = queryFactory
                .selectFrom(qAuthor)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        // Handling sort if needed or default by name
        query.orderBy(qAuthor.name.asc());

        List<Author> authors = query.fetch();
        long total = queryFactory.selectFrom(qAuthor).where(builder).fetchCount();

        return new PageImpl<>(authors, pageable, total);
    }
}
