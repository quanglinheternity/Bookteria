package com.devteria.book.dto.request;

import java.util.Set;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

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
public class BookCreationRequest {
    @Size(max = 20, message = "ISBN_TOO_LONG")
    String isbn;

    @NotBlank(message = "TITLE_REQUIRED")
    @Size(max = 300, message = "TITLE_TOO_LONG")
    String title;

    String subtitle;
    String description;
    String publisher;

    @Min(value = 0, message = "INVALID_YEAR")
    Integer publishedYear;

    @Min(value = 1, message = "INVALID_PAGE_COUNT")
    Integer pageCount;

    String language;

    Long categoryId;
    Set<Long> authorIds;

    MultipartFile coverImage;
    MultipartFile bookFile;
}
