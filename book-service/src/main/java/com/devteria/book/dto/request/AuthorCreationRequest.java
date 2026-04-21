package com.devteria.book.dto.request;

import java.time.LocalDate;

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
public class AuthorCreationRequest {
    @NotBlank(message = "AUTHOR_NAME_REQUIRED")
    @Size(max = 150, message = "AUTHOR_NAME_TOO_LONG")
    String name;

    String bio;
    LocalDate birthDate;
    String nationality;

    MultipartFile avatar;
}
