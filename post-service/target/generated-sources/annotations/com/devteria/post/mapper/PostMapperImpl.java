package com.devteria.post.mapper;

import com.devteria.post.dto.request.PostCreationRequest;
import com.devteria.post.dto.request.PostUpdateRequest;
import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.entity.Post;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public Post toPost(PostCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Post.PostBuilder post = Post.builder();

        post.bookId( request.getBookId() );
        post.content( request.getContent() );
        post.imageLayout( request.getImageLayout() );
        List<String> list = request.getImageUrls();
        if ( list != null ) {
            post.imageUrls( new ArrayList<String>( list ) );
        }
        post.postType( request.getPostType() );
        post.videoUrl( request.getVideoUrl() );
        post.visibility( request.getVisibility() );

        return post.build();
    }

    @Override
    public PostResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.bookId( post.getBookId() );
        postResponse.commentCount( post.getCommentCount() );
        postResponse.content( post.getContent() );
        postResponse.createdAt( post.getCreatedAt() );
        postResponse.id( post.getId() );
        postResponse.imageLayout( post.getImageLayout() );
        List<String> list = post.getImageUrls();
        if ( list != null ) {
            postResponse.imageUrls( new ArrayList<String>( list ) );
        }
        postResponse.likeCount( post.getLikeCount() );
        postResponse.postType( post.getPostType() );
        postResponse.shareCount( post.getShareCount() );
        postResponse.updatedAt( post.getUpdatedAt() );
        postResponse.videoUrl( post.getVideoUrl() );
        postResponse.visibility( post.getVisibility() );

        return postResponse.build();
    }

    @Override
    public void updatePost(Post post, PostUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getContent() != null ) {
            post.setContent( request.getContent() );
        }
        if ( post.getImageUrls() != null ) {
            List<String> list = request.getImageUrls();
            if ( list != null ) {
                post.getImageUrls().clear();
                post.getImageUrls().addAll( list );
            }
        }
        else {
            List<String> list = request.getImageUrls();
            if ( list != null ) {
                post.setImageUrls( new ArrayList<String>( list ) );
            }
        }
        if ( request.getPostType() != null ) {
            post.setPostType( request.getPostType() );
        }
        if ( request.getVideoUrl() != null ) {
            post.setVideoUrl( request.getVideoUrl() );
        }
        if ( request.getVisibility() != null ) {
            post.setVisibility( request.getVisibility() );
        }
    }
}
