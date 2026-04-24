package com.devteria.post.repository.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.devteria.post.entity.Post;

public interface PostRepositoryCustom {
    Page<Post> findAllCustom(String userId, String excludeUserId, String keyword, Pageable pageable);
}
