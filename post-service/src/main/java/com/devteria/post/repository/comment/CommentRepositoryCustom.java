package com.devteria.post.repository.comment;

import java.util.List;

import com.devteria.post.entity.Comment;

public interface CommentRepositoryCustom {
    List<Comment> getNestedComments(String postId);
}
