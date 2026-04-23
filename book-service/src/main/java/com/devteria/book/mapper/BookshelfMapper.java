package com.devteria.book.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devteria.book.dto.request.BookshelfRequest;
import com.devteria.book.dto.response.BookshelfResponse;
import com.devteria.book.entity.UserBookShelf;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {BookMapper.class})
public interface BookshelfMapper {
    @Mapping(target = "book", ignore = true)
    UserBookShelf toUserBookShelf(BookshelfRequest request);

    BookshelfResponse toBookshelfResponse(UserBookShelf userBookShelf);

    @Mapping(target = "book", ignore = true)
    void updateUserBookShelf(@MappingTarget UserBookShelf userBookShelf, BookshelfRequest request);
}
