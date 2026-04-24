package com.devteria.post.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.devteria.post.repository.httpClient.ProfileClient;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.devteria.post.dto.request.CommentCreationRequest;
import com.devteria.post.dto.request.CommentUpdateRequest;
import com.devteria.post.dto.response.CommentResponse;
import com.devteria.post.entity.Comment;
import com.devteria.post.entity.CommentLike;
import com.devteria.post.mapper.CommentMapper;
import com.devteria.post.repository.comment.CommentRepository;
import com.devteria.post.repository.post.PostRepository;
import com.devteria.post.repository.like.CommentLikeRepository;
import com.devteria.post.dto.PageResponse;
import com.devteria.post.exception.AppException;
import com.devteria.post.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepository commentRepository;
    CommentLikeRepository commentLikeRepository;
    PostRepository postRepository;
    CommentMapper commentMapper;
    ProfileClient profileClient;
    HttpServletRequest request;

    public CommentResponse createComment(CommentCreationRequest request) {
        Comment comment = commentMapper.toComment(request);
        comment.setUserId(this.request.getHeader("X-User-Id"));
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());

        comment = commentRepository.save(comment);

        // Update comment count in post
        var post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        // Update reply count in parent if exists
        if (request.getParentId() != null) {
            commentRepository.findById(request.getParentId()).ifPresent(parent -> {
                parent.setReplyCount(parent.getReplyCount() + 1);
                commentRepository.save(parent);
            });
        }

        CommentResponse response = commentMapper.toCommentResponse(comment);
        try {
            var profile = profileClient.getProfile(comment.getUserId()).getResult();
            response.setUserName(profile.getLastName()); // or firstName + lastName
            response.setUserAvatar(profile.getAvatar());
        } catch (Exception e) {
            log.error("Failed to fetch profile for user: {}", comment.getUserId(), e);
        }
        return response;
    }

    public CommentResponse updateComment(String commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Check ownership
        String currentUserId = this.request.getHeader("X-User-Id");
        if (!comment.getUserId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        commentMapper.updateComment(comment, request);
        comment.setUpdatedAt(Instant.now());

        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    public void deleteComment(String commentId) {
        Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Check ownership
        String currentUserId = this.request.getHeader("X-User-Id");
        if (!comment.getUserId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        comment.setDeletedAt(Instant.now());
        commentRepository.save(comment);
    }

    public PageResponse<CommentResponse> getCommentsByPost(String postId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Comment> commentPage = commentRepository.findAllByPostIdAndParentIdIsNullAndDeletedAtIsNull(postId, pageable);

        Map<String, com.devteria.post.dto.response.UserProfileResponse> profileCache = new java.util.HashMap<>();

        List<CommentResponse> responses = commentPage.getContent().stream()
                .map(comment -> {
                    CommentResponse response = commentMapper.toCommentResponse(comment);
                    populateProfile(response, profileCache);
                    return response;
                }).toList();

        return PageResponse.<CommentResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .data(responses)
                .build();
    }

    public PageResponse<CommentResponse> getRepliesByComment(String commentId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Comment> replyPage = commentRepository.findAllByParentIdAndDeletedAtIsNull(commentId, pageable);

        Map<String, com.devteria.post.dto.response.UserProfileResponse> profileCache = new java.util.HashMap<>();

        List<CommentResponse> responses = replyPage.getContent().stream()
                .map(comment -> {
                    CommentResponse response = commentMapper.toCommentResponse(comment);
                    populateProfile(response, profileCache);
                    return response;
                }).toList();

        return PageResponse.<CommentResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(replyPage.getTotalElements())
                .totalPages(replyPage.getTotalPages())
                .data(responses)
                .build();
    }

    private void populateProfile(CommentResponse response, Map<String, com.devteria.post.dto.response.UserProfileResponse> cache) {
        String userId = response.getUserId();
        if (userId == null) return;
        
        try {
            var profile = cache.computeIfAbsent(userId, id -> profileClient.getProfile(id).getResult());
            if (profile != null) {
                response.setUserName(profile.getLastName());
                response.setUserAvatar(profile.getAvatar());
            }

            String currentUserId = request.getHeader("X-User-Id");
            if (currentUserId != null) {
                response.setLiked(commentLikeRepository.existsByUserIdAndCommentId(currentUserId, response.getId()));
            }
        } catch (Exception e) {
            log.error("Error fetching profile for user {}: {}", userId, e.getMessage());
        }
    }


    public void likeComment(String commentId) {
        String userId = request.getHeader("X-User-Id");
        if (commentLikeRepository.existsByUserIdAndCommentId(userId, commentId)) {
            return;
        }

        CommentLike commentLike = CommentLike.builder()
                .userId(userId)
                .commentId(commentId)
                .createdAt(Instant.now())
                .build();
        commentLikeRepository.save(commentLike);

        Comment comment = commentRepository.findById(commentId).orElseThrow();
        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    public void unlikeComment(String commentId) {
        String userId = request.getHeader("X-User-Id");
        if (!commentLikeRepository.existsByUserIdAndCommentId(userId, commentId)) {
            return;
        }

        commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);

        Comment comment = commentRepository.findById(commentId).orElseThrow();
        comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
        commentRepository.save(comment);
    }
}
