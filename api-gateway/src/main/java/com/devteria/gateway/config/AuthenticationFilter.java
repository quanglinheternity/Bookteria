package com.devteria.gateway.config;

import com.devteria.gateway.dto.ApiResponse;
import com.devteria.gateway.service.IdentityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE,makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    IdentityService identityService;
    ObjectMapper objectMapper;
    @NonFinal
    String[] publicEndpoints = {
            "/identity/auth/.*", "/identity/users/registration",
            "/notification/email/send", "/file/media/download/.*",
            ".*/v3/api-docs.*", ".*/swagger-ui.*"
    };
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (isPublicEndpoint(exchange.getRequest()))
            return chain.filter(exchange);

        // Get token from Header
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (CollectionUtils.isEmpty(authHeader)) {
            return writeErrorResponse(exchange.getResponse(), HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        String token = authHeader.getFirst().replace("Bearer ", "");

        // Verify Token
        return identityService.introspect(token).flatMap(introspectResponseApiResponse -> {
            if (introspectResponseApiResponse.getResult().isValid()) {
                ServerHttpRequest request = exchange.getRequest().mutate()
                        .header("X-User-Id", introspectResponseApiResponse.getResult().getUserId())
                        .build();

                return chain.filter(exchange.mutate().request(request).build());
            } else {
                return writeErrorResponse(exchange.getResponse(), HttpStatus.UNAUTHORIZED, "Unauthenticated");
            }
        }).onErrorResume(throwable -> {
            log.error("Authentication error: {}", throwable.getMessage());
            if (throwable instanceof java.net.ConnectException
                    || throwable.getMessage().contains("Connection refused")
                    || throwable.getMessage().contains("Service Unavailable")) {
                return writeErrorResponse(exchange.getResponse(), HttpStatus.SERVICE_UNAVAILABLE, "Service unavailable");
            }
            return writeErrorResponse(exchange.getResponse(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal error");
        });
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return Arrays.stream(publicEndpoints).anyMatch(path::matches);
    }

    private Mono<Void> writeErrorResponse(ServerHttpResponse response, HttpStatus status, String message) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(status.value())
                .message(message)
                .build();

        String body = "";
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize error response", e);
        }

        response.setStatusCode(status);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
