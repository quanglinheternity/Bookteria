package com.devteria.post.dto.request;

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
public class PostUpdateRequest {
    String content;
    PostType postType;
    List<String> imageUrls;
    String videoUrl;
    Visibility visibility;
}
