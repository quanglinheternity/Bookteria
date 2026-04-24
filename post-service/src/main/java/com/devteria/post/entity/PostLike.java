package com.devteria.post.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post_likes")
@FieldDefaults(level = AccessLevel.PRIVATE)
@CompoundIndex(name = "user_post_unique_idx", def = "{'userId': 1, 'postId': 1}", unique = true)
public class PostLike {
    @Id
    String id;

    String userId;
    String postId;
    Instant createdAt;
}
