package com.devteria.book.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.devteria.book.dto.request.CategoryRequest;
import com.devteria.book.dto.request.CategorySearchRequest;
import com.devteria.book.dto.response.CategoryResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.entity.Category;
import com.devteria.book.exception.AppException;
import com.devteria.book.exception.ErrorCode;
import com.devteria.book.mapper.CategoryMapper;
import com.devteria.book.repository.category.CategoryRepository;
import com.devteria.book.utils.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        Category category = categoryMapper.toCategory(request);
        category.setSlug(generateUniqueSlug(category.getName(), null));

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public PageResponse<CategoryResponse> getAll(int page, int size, CategorySearchRequest criteria) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = categoryRepository.searchCategories(criteria, pageable);

        return PageResponse.<CategoryResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(categoryMapper::toCategoryResponse)
                        .toList())
                .build();
    }

    public CategoryResponse getById(Long id) {
        return categoryRepository
                .findById(id)
                .map(categoryMapper::toCategoryResponse)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.updateCategory(category, request);
        category.setSlug(generateUniqueSlug(category.getName(), id));

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    private String generateUniqueSlug(String name, Long currentId) {
        String baseSlug = SlugUtil.toSlug(name);
        String slug = baseSlug;

        int i = 1;
        while (currentId == null
                ? categoryRepository.existsBySlug(slug)
                : categoryRepository.existsBySlugAndIdNot(slug, currentId)) {
            slug = baseSlug + "-" + i++;
        }
        return slug;
    }
}
