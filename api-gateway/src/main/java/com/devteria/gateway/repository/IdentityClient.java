package com.devteria.gateway.repository;

import com.devteria.gateway.dto.ApiResponse;
import com.devteria.gateway.dto.identiy.IntrospectRequest;
import com.devteria.gateway.dto.identiy.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface IdentityClient {
    @PostExchange(url = "/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}
