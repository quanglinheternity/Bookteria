package com.devteria.book.repository.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.devteria.book.dto.request.CategorySearchRequest;
import com.devteria.book.entity.Category;

public interface CategoryRepositoryCustom {
    Page<Category> searchCategories(CategorySearchRequest criteria, Pageable pageable);
}
