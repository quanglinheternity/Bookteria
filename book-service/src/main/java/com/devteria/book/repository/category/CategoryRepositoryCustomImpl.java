package com.devteria.book.repository.category;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.devteria.book.dto.request.CategorySearchRequest;
import com.devteria.book.entity.Category;
import com.devteria.book.entity.QCategory;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CategoryRepositoryCustomImpl implements CategoryRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Category> searchCategories(CategorySearchRequest criteria, Pageable pageable) {
        QCategory qCategory = QCategory.category;
        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(criteria.getKeyword())) {
            String keyword = criteria.getKeyword().toLowerCase();
            builder.and(qCategory
                    .name
                    .toLowerCase()
                    .contains(keyword)
                    .or(qCategory.description.toLowerCase().contains(keyword)));
        }

        JPAQuery<Category> query = queryFactory
                .selectFrom(qCategory)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        query.orderBy(qCategory.name.asc());

        List<Category> categories = query.fetch();
        long total = queryFactory.selectFrom(qCategory).where(builder).fetchCount();

        return new PageImpl<>(categories, pageable, total);
    }
}
