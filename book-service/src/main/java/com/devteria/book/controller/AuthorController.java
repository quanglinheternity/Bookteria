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
import com.devteria.book.dto.request.AuthorCreationRequest;
import com.devteria.book.dto.request.AuthorSearchRequest;
import com.devteria.book.dto.request.AuthorUpdateRequest;
import com.devteria.book.dto.response.AuthorResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.service.AuthorService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/authors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorController {
    AuthorService authorService;

    @PostMapping("/create")
    ResponseEntity<ApiResponse<AuthorResponse>> create(@ModelAttribute @Valid AuthorCreationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AuthorResponse>builder()
                        .result(authorService.create(request))
                        .message("Author has been created")
                        .build());
    }

    @GetMapping("/get-all")
    ResponseEntity<ApiResponse<PageResponse<AuthorResponse>>> getAll(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.<PageResponse<AuthorResponse>>builder()
                .result(authorService.getAll(
                        page,
                        size,
                        AuthorSearchRequest.builder().keyword(keyword).build()))
                .message("List of authors")
                .build());
    }

    @GetMapping("/{id}/detail")
    ResponseEntity<ApiResponse<AuthorResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<AuthorResponse>builder()
                .result(authorService.getById(id))
                .message("Author detail")
                .build());
    }

    @PutMapping("/{id}/update")
    ResponseEntity<ApiResponse<AuthorResponse>> update(
            @PathVariable Long id, @ModelAttribute @Valid AuthorUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthorResponse>builder()
                .result(authorService.update(id, request))
                .message("Author has been updated")
                .build());
    }

    @DeleteMapping("/{id}/delete")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Author has been deleted").build());
    }
}
