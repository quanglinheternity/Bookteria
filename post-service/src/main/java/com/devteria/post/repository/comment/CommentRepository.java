package com.devteria.post.repository.comment;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devteria.post.entity.Comment;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String>, CommentRepositoryCustom {
    Optional<Comment> findByIdAndDeletedAtIsNull(String id);
    java.util.List<Comment> findAllByPostIdAndDeletedAtIsNull(String postId, org.springframework.data.domain.Sort sort);
    Page<Comment> findAllByPostIdAndParentIdIsNullAndDeletedAtIsNull(String postId, Pageable pageable);
    Page<Comment> findAllByParentIdAndDeletedAtIsNull(String parentId, Pageable pageable);
}
