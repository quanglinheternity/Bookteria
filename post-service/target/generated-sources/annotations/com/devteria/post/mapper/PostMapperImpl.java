package com.devteria.post.mapper;

import com.devteria.post.dto.response.PostResponse;
import com.devteria.post.entity.Post;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.content( post.getContent() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.id( post.getId() );
        postResponse.modifiedDate( post.getModifiedDate() );
        postResponse.userId( post.getUserId() );

        return postResponse.build();
    }
}
