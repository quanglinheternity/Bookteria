package com.devteria.book.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.devteria.book.dto.request.ApiResponse;
import com.devteria.book.dto.request.CategoryRequest;
import com.devteria.book.dto.response.CategoryResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping("/create")
    ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request))
                .message("Category has been created")
                .build();
    }

    @GetMapping("/list")
    ApiResponse<PageResponse<CategoryResponse>> getAll(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CategoryResponse>>builder()
                .result(categoryService.getAll(page, size))
                .message("List of categories")
                .build();
    }

    @GetMapping("/{id}/detail")
    ApiResponse<CategoryResponse> getById(@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getById(id))
                .message("Category detail")
                .build();
    }

    @PutMapping("/{id}/update")
    ApiResponse<CategoryResponse> update(@PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.update(id, request))
                .message("Category has been updated")
                .build();
    }

    @DeleteMapping("/{id}/delete")
    ApiResponse<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.<Void>builder().message("Category has been deleted").build();
    }
}
