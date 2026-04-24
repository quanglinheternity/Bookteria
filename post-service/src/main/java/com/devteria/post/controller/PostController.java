package com.devteria.post.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.devteria.post.dto.ApiResponse;
import com.devteria.post.dto.PageResponse;
import com.devteria.post.dto.request.PostCreationRequest;
import com.devteria.post.dto.request.PostUpdateRequest;
import com.devteria.post.dto.response.FileResponse;
import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.service.PostService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @PostMapping(value = "/upload-media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> uploadMedia(@RequestPart("file") MultipartFile file) {
        return ApiResponse.<FileResponse>builder()
                .result(postService.uploadMedia(file))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<PostResponse> createPost(@RequestBody PostCreationRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(request))
                .build();
    }

    @GetMapping("/my-posts")
    ApiResponse<PageResponse<PostResponse>> myPost(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getMyPost(page, size))
                .build();
    }

    @GetMapping("/user/{userId}")
    ApiResponse<PageResponse<PostResponse>> getPostsByUserId(
            @PathVariable String userId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getPostsByUserId(userId, page, size))
                .build();
    }

    @GetMapping("/{postId}/detail")
    ApiResponse<PostResponse> getPost(@PathVariable String postId) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPostById(postId))
                .build();
    }

    @PutMapping("/{postId}/update")
    ApiResponse<PostResponse> updatePost(@PathVariable String postId, @RequestBody PostUpdateRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.updatePost(postId, request))
                .build();
    }

    @DeleteMapping("/{postId}/delete")
    ApiResponse<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ApiResponse.<Void>builder().message("Post deleted").build();
    }

    @PutMapping(value = "/{postId}/replace-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<PostResponse> replaceImage(
            @PathVariable String postId,
            @RequestParam("oldUrl") String oldUrl,
            @RequestPart("file") MultipartFile file) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.replacePostImage(postId, oldUrl, file))
                .build();
    }

    @GetMapping("/all")
    ApiResponse<PageResponse<PostResponse>> getAllPosts(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getPosts(page, size))
                .build();
    }

    @PostMapping("/{postId}/like")
    ApiResponse<Void> likePost(@PathVariable String postId) {
        postService.likePost(postId);
        return ApiResponse.<Void>builder().message("Post liked").build();
    }

    @PostMapping("/{postId}/unlike")
    ApiResponse<Void> unlikePost(@PathVariable String postId) {
        postService.unlikePost(postId);
        return ApiResponse.<Void>builder().message("Post unliked").build();
    }
}