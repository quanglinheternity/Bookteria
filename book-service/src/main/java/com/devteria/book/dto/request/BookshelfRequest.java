package com.devteria.book.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

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
public class BookshelfRequest {
    @NotNull(message = "BOOK_ID_REQUIRED")
    Long bookId;

    @NotNull(message = "STATUS_REQUIRED")
    ReadingStatus status;

    @Min(value = 0, message = "PROGRESS_INVALID")
    @Max(value = 100, message = "PROGRESS_INVALID")
    Integer progress;

    @Min(value = 1, message = "RATING_INVALID")
    @Max(value = 5, message = "RATING_INVALID")
    Integer rating;

    String reviewNote;
}
