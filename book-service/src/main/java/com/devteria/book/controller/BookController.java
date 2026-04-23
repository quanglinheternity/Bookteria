package com.devteria.book.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devteria.book.dto.ApiResponse;
import com.devteria.book.dto.request.BookCreationRequest;
import com.devteria.book.dto.request.BookSearchRequest;
import com.devteria.book.dto.request.BookUpdateRequest;
import com.devteria.book.dto.response.BookResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.service.BookService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookController {
    BookService bookService;

    @PostMapping("/create")
    ResponseEntity<ApiResponse<BookResponse>> create(@ModelAttribute @Valid BookCreationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookResponse>builder()
                        .result(bookService.create(request))
                        .message("Book has been created")
                        .build());
    }

    @GetMapping("/search")
    ResponseEntity<ApiResponse<PageResponse<BookResponse>>> search(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            BookSearchRequest criteria) {
        return ResponseEntity.ok(ApiResponse.<PageResponse<BookResponse>>builder()
                .result(bookService.searchBooks(page, size, criteria))
                .message("Search results")
                .build());
    }

    @GetMapping("/{id}/detail")
    ResponseEntity<ApiResponse<BookResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<BookResponse>builder()
                .result(bookService.getById(id))
                .message("Book detail")
                .build());
    }

    @PutMapping("/{id}/update")
    ResponseEntity<ApiResponse<BookResponse>> update(
            @PathVariable Long id, @ModelAttribute @Valid BookUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.<BookResponse>builder()
                .result(bookService.update(id, request))
                .message("Book has been updated")
                .build());
    }

    @DeleteMapping("/{id}/delete")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Book has been deleted").build());
    }
}
