package com.devteria.post.repository.like;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devteria.post.entity.CommentLike;

@Repository
public interface CommentLikeRepository extends MongoRepository<CommentLike, String> {
    boolean existsByUserIdAndCommentId(String userId, String commentId);
    void deleteByUserIdAndCommentId(String userId, String commentId);
}
