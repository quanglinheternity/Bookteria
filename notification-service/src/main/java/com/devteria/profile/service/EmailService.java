package com.devteria.profile.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devteria.profile.dto.Email.EmailRequest;
import com.devteria.profile.dto.Email.EmailResponse;
import com.devteria.profile.dto.Email.SendEmailRequest;
import com.devteria.profile.dto.Email.Sender;
import com.devteria.profile.exception.AppException;
import com.devteria.profile.exception.ErrorCode;
import com.devteria.profile.repository.httpClient.EmailClient;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    EmailClient emailClient;
    String apiKey = "";

    public EmailResponse sendEmail(SendEmailRequest request) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("quang linh")
                        .email("nguyenquanglinh0509@gmail.com")
                        .build())
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .htmlContent(request.getHtmlContent())
                .build();

        try {
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            e.printStackTrace();
            throw new AppException(ErrorCode.CANNOT_SEND_MAIL);
        }
    }
}
