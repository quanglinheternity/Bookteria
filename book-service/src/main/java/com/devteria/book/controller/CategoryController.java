package com.devteria.book.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devteria.book.dto.ApiResponse;
import com.devteria.book.dto.request.CategoryRequest;
import com.devteria.book.dto.request.CategorySearchRequest;
import com.devteria.book.dto.response.CategoryResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping("/create")
    ResponseEntity<ApiResponse<CategoryResponse>> create(@RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CategoryResponse>builder()
                        .result(categoryService.create(request))
                        .message("Category has been created")
                        .build());
    }

    @GetMapping("/get-all")
    ResponseEntity<ApiResponse<PageResponse<CategoryResponse>>> getAll(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.<PageResponse<CategoryResponse>>builder()
                .result(categoryService.getAll(
                        page,
                        size,
                        CategorySearchRequest.builder().keyword(keyword).build()))
                .message("List of categories")
                .build());
    }

    @GetMapping("/{id}/detail")
    ResponseEntity<ApiResponse<CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getById(id))
                .message("Category detail")
                .build());
    }

    @PutMapping("/{id}/update")
    ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .result(categoryService.update(id, request))
                .message("Category has been updated")
                .build());
    }

    @DeleteMapping("/{id}/delete")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Category has been deleted").build());
    }
}
