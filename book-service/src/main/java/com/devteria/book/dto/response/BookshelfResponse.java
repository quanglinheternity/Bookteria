package com.devteria.book.dto.response;

import java.time.Instant;
import java.time.LocalDate;

import com.devteria.book.entity.ReadingStatus;

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
public class BookshelfResponse {
    Long id;
    ReadingStatus status;
    Integer progress;
    LocalDate startedAt;
    LocalDate finishedAt;
    Integer rating;
    String reviewNote;
    Instant createdAt;
    Instant updatedAt;

    BookResponse book;
}
