package com.devteria.post.entity;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.devteria.post.constant.PostType;
import com.devteria.post.constant.Visibility;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@CompoundIndex(name = "user_createdAt_idx", def = "{'userId': 1, 'createdAt': -1}")
public class Post {
    @Id
    String id;

    @Indexed
    String userId;

    @Indexed
    Long bookId;

    String content;

    @Indexed
    PostType postType;

    List<String> imageUrls;
    String imageLayout;
    String videoUrl;

    long likeCount;
    long commentCount;
    long shareCount;

    Visibility visibility;

    @Indexed
    Instant createdAt;

    Instant updatedAt;

    Instant deletedAt;
}
