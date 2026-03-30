package com.devteria.profile.controller;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.devteria.event.dto.NotificationEvent;
import com.devteria.profile.dto.Email.Recipient;
import com.devteria.profile.dto.Email.SendEmailRequest;
import com.devteria.profile.service.EmailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    EmailService emailService;

    @KafkaListener(topics = "notification-delivery")
    public void listenNotificationDelivery(NotificationEvent message) {
        log.info("Message received: {}", message);
        try {
            emailService.sendEmail(SendEmailRequest.builder()
                    .to(Recipient.builder().email(message.getRecipient()).build())
                    .subject(message.getSubject())
                    .htmlContent(message.getBody())
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Send email failed", e);
        }
    }
}
