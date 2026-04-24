package com.devteria.post.controller;

import org.springframework.web.bind.annotation.*;

import com.devteria.post.dto.ApiResponse;
import com.devteria.post.dto.PageResponse;
import com.devteria.post.dto.request.CommentCreationRequest;
import com.devteria.post.dto.request.CommentUpdateRequest;
import com.devteria.post.dto.response.CommentResponse;
import com.devteria.post.service.CommentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping("/")
    ApiResponse<CommentResponse> createComment(@RequestBody CommentCreationRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request))
                .build();
    }

    @GetMapping("/post/{postId}")
    ApiResponse<PageResponse<CommentResponse>> getCommentsByPost(
            @PathVariable String postId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getCommentsByPost(postId, page, size))
                .build();
    }

    @GetMapping("/{commentId}/replies")
    ApiResponse<PageResponse<CommentResponse>> getRepliesByComment(
            @PathVariable String commentId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getRepliesByComment(commentId, page, size))
                .build();
    }

    @PutMapping("/{commentId}")
    ApiResponse<CommentResponse> updateComment(
            @PathVariable String commentId, @RequestBody CommentUpdateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(commentId, request))
                .build();
    }

    @DeleteMapping("/{commentId}")
    ApiResponse<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.<Void>builder().message("Comment deleted").build();
    }

    @PostMapping("/{commentId}/like")
    ApiResponse<Void> likeComment(@PathVariable String commentId) {
        commentService.likeComment(commentId);
        return ApiResponse.<Void>builder().message("Comment liked").build();
    }

    @PostMapping("/{commentId}/unlike")
    ApiResponse<Void> unlikeComment(@PathVariable String commentId) {
        commentService.unlikeComment(commentId);
        return ApiResponse.<Void>builder().message("Comment unliked").build();
    }
}
