package com.devteria.chat.controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.devteria.chat.dto.request.IntrospectRequest;
import com.devteria.chat.entity.WebSocketSession;
import com.devteria.chat.service.IdentityService;
import com.devteria.chat.service.WebSocketSessionService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;
    IdentityService identityService;
    WebSocketSessionService webSocketSessionService;

    @OnConnect
    public void clientConnected(SocketIOClient client){
        //get token from request
        String token = client.getHandshakeData().getSingleUrlParam("token");
        //verify token
        var introspectResponse =  identityService.introspect(IntrospectRequest.builder().token(token).build());
        //if token is invaild disconnect

        if (introspectResponse.isValid()){
            log.info("client connected: {}",client.getSessionId());
            //Persist websokectSession
            WebSocketSession webSocketSession = WebSocketSession.builder()
                    .socketSessionId(client.getSessionId().toString())
                    .userId(introspectResponse.getUserId())
                    .createdAt(Instant.now())
                    .build();
            webSocketSession =webSocketSessionService.create(webSocketSession);
            log.info("webSocketSession create in,{}",webSocketSession);
        }else {
            log.info("Authentication fail: {}",client.getSessionId());
            client.disconnect();
        }
    }
    @OnDisconnect
    public void clientDisconnected(SocketIOClient client){
        log.info("client Disconnected: {}",client.getSessionId());
        webSocketSessionService.deleteSession(client.getSessionId().toString());
    }
    @PostConstruct
    public void startServer(){
        server.start();
        server.addListeners(this);
        log.info("socket server started");
    }

    @PreDestroy
    public void stopServer(){
        server.stop();
        server.addListeners(this);
        log.info("socket server stoped");
    }
}
