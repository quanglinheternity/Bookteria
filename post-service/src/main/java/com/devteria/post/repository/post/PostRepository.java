package com.devteria.post.repository.post;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devteria.post.entity.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String>, PostRepositoryCustom {
    Optional<Post> findByIdAndDeletedAtIsNull(String id);
}
