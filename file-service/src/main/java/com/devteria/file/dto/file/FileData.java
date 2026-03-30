package com.devteria.file.dto.file;

import org.springframework.core.io.Resource;

public record FileData(
        String contentType,
        Resource resource
) {
}
