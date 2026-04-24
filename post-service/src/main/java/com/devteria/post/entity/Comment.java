package com.devteria.post.entity;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
@FieldDefaults(level = AccessLevel.PRIVATE)
@CompoundIndex(name = "post_createdAt_idx", def = "{'postId': 1, 'createdAt': 1}")
public class Comment {
    @Id
    String id;

    @Indexed
    String userId;

    @Indexed
    String postId;

    @Indexed
    String parentId;

    String content;

    long likeCount;
    long replyCount;

    Instant createdAt;
    Instant updatedAt;
    Instant deletedAt;

    List<Comment> replies;
}
