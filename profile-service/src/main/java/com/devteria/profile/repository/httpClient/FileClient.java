package com.devteria.profile.repository.httpClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.devteria.profile.config.AuthenticationRequestInterceptor;
import com.devteria.profile.dto.ApiResponse;
import com.devteria.profile.dto.file.FileResponse;

@FeignClient(
        name = "file-service",
        url = "${app.services.file}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface FileClient {
    @PostMapping(value = "/file/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> uploadMedia(@RequestPart("file") MultipartFile file);
}
