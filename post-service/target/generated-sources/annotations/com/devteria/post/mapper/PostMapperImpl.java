package com.devteria.post.mapper;

import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.entity.Post;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Ubuntu)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( post.getId() );
        postResponse.content( post.getContent() );
        postResponse.userId( post.getUserId() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.modifiedDate( post.getModifiedDate() );

        return postResponse.build();
    }
}
