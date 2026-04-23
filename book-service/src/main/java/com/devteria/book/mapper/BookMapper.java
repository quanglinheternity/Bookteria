package com.devteria.book.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devteria.book.dto.request.BookCreationRequest;
import com.devteria.book.dto.request.BookUpdateRequest;
import com.devteria.book.dto.response.BookResponse;
import com.devteria.book.entity.Book;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookMapper {
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "authors", ignore = true)
    Book toBook(BookCreationRequest request);

    BookResponse toBookResponse(Book book);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "authors", ignore = true)
    void updateBook(@MappingTarget Book book, BookUpdateRequest request);
}
