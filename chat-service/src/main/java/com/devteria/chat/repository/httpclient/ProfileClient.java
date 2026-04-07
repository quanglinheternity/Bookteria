package com.devteria.chat.repository.httpclient;

import com.devteria.chat.configuration.AuthenticationRequestInterceptor;
import com.devteria.chat.dto.ApiResponse;
import com.devteria.chat.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "profile-service", url = "${app.services.profile.url}", configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileClient {
    @GetMapping("/users/internal/{userId}/detail")
    ApiResponse<UserProfileResponse> getProfile(@PathVariable String userId);
}
