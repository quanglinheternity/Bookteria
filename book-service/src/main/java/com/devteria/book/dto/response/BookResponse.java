package com.devteria.book.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    Long id;
    String isbn;
    String title;
    String subtitle;
    String description;
    String publisher;
    Integer publishedYear;
    Integer pageCount;
    String language;
    String coverImageUrl;
    String bookFileUrl;
    BigDecimal averageRating;
    Integer totalReviews;
    Integer totalReads;
    UUID createdBy;
    Instant createdAt;
    Instant updatedAt;

    CategoryResponse category;
    Set<AuthorResponse> authors;
}
