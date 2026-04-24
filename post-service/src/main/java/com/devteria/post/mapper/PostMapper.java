package com.devteria.post.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devteria.post.dto.request.PostCreationRequest;
import com.devteria.post.dto.request.PostUpdateRequest;
import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.entity.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {
    Post toPost(PostCreationRequest request);

    PostResponse toPostResponse(Post post);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePost(@MappingTarget Post post, PostUpdateRequest request);
}
