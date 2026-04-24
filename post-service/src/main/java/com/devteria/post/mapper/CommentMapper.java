package com.devteria.post.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.devteria.post.dto.request.CommentCreationRequest;
import com.devteria.post.dto.request.CommentUpdateRequest;
import com.devteria.post.dto.response.CommentResponse;
import com.devteria.post.entity.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toComment(CommentCreationRequest request);

    CommentResponse toCommentResponse(Comment comment);

    void updateComment(@MappingTarget Comment comment, CommentUpdateRequest request);
}
