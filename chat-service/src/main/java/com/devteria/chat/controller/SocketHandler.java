package com.devteria.chat.controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer server;

    @OnConnect
    public void clientConnected(SocketIOClient client){
        log.info("client connected: {}",client.getSessionId());
    }
    @OnDisconnect
    public void clientDisconnected(SocketIOClient client){
        log.info("client Disconnected: {}",client.getSessionId());
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
