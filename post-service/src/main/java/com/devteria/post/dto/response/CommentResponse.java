package com.devteria.post.dto.response;

import java.time.Instant;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    String id;
    String userId;
    String userName;
    String userAvatar;
    String content;
    long likeCount;
    long replyCount;
    Instant createdAt;
    List<CommentResponse> replies;
    boolean isLiked;
}
