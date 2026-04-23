package com.devteria.book.dto.request;

import java.util.Set;

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
public class BookUpdateRequest {
    @Size(max = 20, message = "ISBN_TOO_LONG")
    String isbn;

    @Size(max = 300, message = "TITLE_TOO_LONG")
    String title;

    String subtitle;
    String description;
    String publisher;
    Integer publishedYear;
    Integer pageCount;
    String language;

    Long categoryId;
    Set<Long> authorIds;

    MultipartFile coverImage;
    MultipartFile bookFile;
}
