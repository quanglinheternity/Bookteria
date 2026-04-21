package com.devteria.book.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devteria.book.dto.request.AuthorCreationRequest;
import com.devteria.book.dto.request.AuthorUpdateRequest;
import com.devteria.book.dto.response.AuthorResponse;
import com.devteria.book.entity.Author;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AuthorMapper {
    Author toAuthor(AuthorCreationRequest request);

    AuthorResponse toAuthorResponse(Author author);

    void updateAuthor(@MappingTarget Author author, AuthorUpdateRequest request);
}
