package com.devteria.post.dto.response;

import java.time.Instant;
import java.util.List;

import com.devteria.post.constant.PostType;
import com.devteria.post.constant.Visibility;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    UserProfileResponse user;
    Long bookId;
    String content;
    PostType postType;
    List<String> imageUrls;
    String imageLayout;
    String videoUrl;

    long likeCount;
    long commentCount;
    long shareCount;

    Visibility visibility;
    @com.fasterxml.jackson.annotation.JsonProperty("isLiked")
    boolean isLiked;

    String created;
    Instant createdAt;
    Instant updatedAt;
}
