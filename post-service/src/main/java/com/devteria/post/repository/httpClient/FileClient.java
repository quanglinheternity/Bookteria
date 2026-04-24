package com.devteria.post.repository.httpClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.devteria.post.configuration.AuthenticationRequestInterceptor;
import com.devteria.post.dto.ApiResponse;
import com.devteria.post.dto.response.FileResponse;

@FeignClient(
        name = "file-service",
        url = "${app.services.file.url}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface FileClient {
    @PostMapping(value = "/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> uploadMedia(@RequestPart("file") MultipartFile file);

    @DeleteMapping("/media/{fileName}")
    ApiResponse<Void> deleteMedia(@PathVariable("fileName") String fileName);

    @PutMapping(value = "/media/{fileName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> updateMedia(@PathVariable("fileName") String fileName, @RequestPart("file") MultipartFile file);
}
