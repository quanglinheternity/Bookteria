package com.devteria.post.repository.like;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devteria.post.entity.PostLike;

@Repository
public interface PostLikeRepository extends MongoRepository<PostLike, String> {
    boolean existsByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
}
