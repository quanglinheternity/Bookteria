package com.devteria.post.service;

import com.devteria.post.dto.PageResponse;
import com.devteria.post.dto.request.PostCreationRequest;
import com.devteria.post.dto.request.PostUpdateRequest;
import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.dto.response.UserProfileResponse;
import com.devteria.post.entity.Post;
import com.devteria.post.mapper.PostMapper;
import com.devteria.post.repository.post.PostRepository;
import com.devteria.post.repository.like.PostLikeRepository;
import com.devteria.post.repository.httpClient.ProfileClient;
import com.devteria.post.repository.httpClient.FileClient;
import com.devteria.post.entity.PostLike;
import com.devteria.post.dto.response.FileResponse;
import com.devteria.post.exception.AppException;
import com.devteria.post.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostLikeRepository postLikeRepository;
    PostMapper postMapper;
    TimeFormatter timeFormatter;
    ProfileClient profileClient;
    FileClient fileClient;
    HttpServletRequest request;

    public FileResponse uploadMedia(MultipartFile file) {
        return fileClient.uploadMedia(file).getResult();
    }

    private void deleteFileByUrl(String url) {
        if (!StringUtils.hasText(url))
            return;
        try {
            String fileName = url.substring(url.lastIndexOf("/") + 1);
            fileClient.deleteMedia(fileName);
        } catch (Exception e) {
            log.error("Failed to delete file from URL: {}", url, e);
        }
    }

    public PostResponse createPost(PostCreationRequest request) {
        Post post = postMapper.toPost(request);
        post.setUserId(this.request.getHeader("X-User-Id"));
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());

        Post savedPost = postRepository.save(post);
        PostResponse response = postMapper.toPostResponse(savedPost);
        try {
            response.setUser(profileClient.getProfile(post.getUserId()).getResult());
        } catch (Exception e) {
            log.error("Failed to fetch profile during post creation", e);
        }
        return response;
    }

    public PageResponse<PostResponse> getMyPost(int page, int size) {
        String userId = request.getHeader("X-User-Id");
        return getPostsByUserId(userId, page, size);
    }

    public PageResponse<PostResponse> getPostsByUserId(String userId, int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = postRepository.findAllCustom(userId, null, null, pageable);

        Map<String, UserProfileResponse> profileCache = new java.util.HashMap<>();
        var postList = pageData.getContent().stream()
                .map(post -> {
                    var postResponse = postMapper.toPostResponse(post);
                    postResponse.setCreated(timeFormatter.format(post.getCreatedAt()));
                    postResponse.setLiked(postLikeRepository.existsByUserIdAndPostId(userId, post.getId()));

                    try {
                        postResponse.setUser(profileCache.computeIfAbsent(post.getUserId(),
                                id -> profileClient.getProfile(id).getResult()));
                    } catch (Exception e) {
                        log.error("Error fetching profile for user {}", post.getUserId());
                    }

                    return postResponse;
                })
                .toList();

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    public PostResponse getPostById(String postId) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        PostResponse response = postMapper.toPostResponse(post);
        response.setCreated(timeFormatter.format(post.getCreatedAt()));

        String currentUserId = request.getHeader("X-User-Id");
        if (StringUtils.hasText(currentUserId)) {
            response.setLiked(postLikeRepository.existsByUserIdAndPostId(currentUserId, post.getId()));
        }

        // Optionally fetch user info
        try {
            response.setUser(profileClient.getProfile(post.getUserId()).getResult());
        } catch (Exception e) {
            log.error("Error while getting user profile", e);
        }

        return response;
    }

    public PostResponse updatePost(String postId, PostUpdateRequest request) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // Check ownership
        String currentUserId = this.request.getHeader("X-User-Id");
        if (!post.getUserId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        // Handle file cleanup for images
        if (request.getImageUrls() != null) {
            List<String> oldImages = post.getImageUrls();
            if (oldImages != null) {
                oldImages.stream()
                        .filter(url -> !request.getImageUrls().contains(url))
                        .forEach(this::deleteFileByUrl);
            }
        }

        // Handle file cleanup for video
        if (request.getVideoUrl() != null && post.getVideoUrl() != null
                && !request.getVideoUrl().equals(post.getVideoUrl())) {
            deleteFileByUrl(post.getVideoUrl());
        }

        postMapper.updatePost(post, request);
        post.setUpdatedAt(Instant.now());

        return postMapper.toPostResponse(postRepository.save(post));
    }

    public void deletePost(String postId) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // Check ownership
        String currentUserId = this.request.getHeader("X-User-Id");
        if (!post.getUserId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        // Delete associated files
        if (post.getImageUrls() != null) {
            post.getImageUrls().forEach(this::deleteFileByUrl);
        }
        if (post.getVideoUrl() != null) {
            deleteFileByUrl(post.getVideoUrl());
        }

        post.setDeletedAt(Instant.now());
        postRepository.save(post);
    }

    public PostResponse replacePostImage(String postId, String oldUrl, MultipartFile file) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        // Check ownership
        String currentUserId = this.request.getHeader("X-User-Id");
        if (!post.getUserId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        // 1. Gọi file-service để cập nhật file vật lý
        String fileName = oldUrl.substring(oldUrl.lastIndexOf("/") + 1);
        FileResponse fileResponse = fileClient.updateMedia(fileName, file).getResult();
        String newUrl = fileResponse.getUrl();

        // 2. Cập nhật lại danh sách URL trong database
        List<String> imageUrls = post.getImageUrls();
        if (imageUrls != null && imageUrls.contains(oldUrl)) {
            int index = imageUrls.indexOf(oldUrl);
            imageUrls.set(index, newUrl);
            post.setImageUrls(imageUrls);
        }

        post.setUpdatedAt(Instant.now());
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public PageResponse<PostResponse> getPosts(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        String currentUserId = request.getHeader("X-User-Id");
        var pageData = postRepository.findAllCustom(null, null, null, pageable);

        Map<String, UserProfileResponse> profileCache = new java.util.HashMap<>();

        var postList = pageData.getContent().stream()
                .map(post -> {
                    var postResponse = postMapper.toPostResponse(post);
                    postResponse.setCreated(timeFormatter.format(post.getCreatedAt()));
                    if (StringUtils.hasText(currentUserId)) {
                        postResponse.setLiked(postLikeRepository.existsByUserIdAndPostId(currentUserId, post.getId()));
                    }

                    try {
                        postResponse.setUser(profileCache.computeIfAbsent(post.getUserId(),
                                id -> profileClient.getProfile(id).getResult()));
                    } catch (Exception e) {
                        log.error("Error fetching profile for user {}", post.getUserId());
                    }

                    return postResponse;
                })
                .toList();

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    public void likePost(String postId) {
        String userId = request.getHeader("X-User-Id");
        if (postLikeRepository.existsByUserIdAndPostId(userId, postId)) {
            return;
        }

        PostLike postLike = PostLike.builder()
                .userId(userId)
                .postId(postId)
                .createdAt(Instant.now())
                .build();
        postLikeRepository.save(postLike);

        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    public void unlikePost(String postId) {
        String userId = request.getHeader("X-User-Id");
        if (!postLikeRepository.existsByUserIdAndPostId(userId, postId)) {
            return;
        }

        postLikeRepository.deleteByUserIdAndPostId(userId, postId);

        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        postRepository.save(post);
    }
}
