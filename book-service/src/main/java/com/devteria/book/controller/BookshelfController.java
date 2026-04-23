package com.devteria.book.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devteria.book.dto.ApiResponse;
import com.devteria.book.dto.request.BookshelfRequest;
import com.devteria.book.dto.request.BookshelfSearchRequest;
import com.devteria.book.dto.response.BookshelfResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.service.BookshelfService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/bookshelf")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookshelfController {
    BookshelfService bookshelfService;

    @PostMapping("/create")
    ResponseEntity<ApiResponse<BookshelfResponse>> addToShelf(@RequestBody @Valid BookshelfRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookshelfResponse>builder()
                        .result(bookshelfService.addToShelf(request))
                        .message("Book added to shelf")
                        .build());
    }

    @GetMapping("/get-my-shelf")
    ResponseEntity<ApiResponse<PageResponse<BookshelfResponse>>> getMyShelf(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            BookshelfSearchRequest criteria) {
        return ResponseEntity.ok(ApiResponse.<PageResponse<BookshelfResponse>>builder()
                .result(bookshelfService.getMyShelf(page, size, criteria))
                .message("Your bookshelf")
                .build());
    }

    @PutMapping("/{id}/update")
    ResponseEntity<ApiResponse<BookshelfResponse>> updateShelf(
            @PathVariable Long id, @RequestBody @Valid BookshelfRequest request) {
        return ResponseEntity.ok(ApiResponse.<BookshelfResponse>builder()
                .result(bookshelfService.updateShelf(id, request))
                .message("Bookshelf updated")
                .build());
    }

    @DeleteMapping("/{id}/delete")
    ResponseEntity<ApiResponse<Void>> removeFromShelf(@PathVariable Long id) {
        bookshelfService.removeFromShelf(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Book removed from shelf").build());
    }
}
