package com.devteria.notification.controller;

import com.devteria.notification.dto.ApiResponse;
import com.devteria.notification.dto.Email.EmailResponse;
import com.devteria.notification.dto.Email.SendEmailRequest;
import com.devteria.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("email/send")
    ApiResponse<EmailResponse> sendEmail(@RequestBody SendEmailRequest request){
        return ApiResponse.<EmailResponse>builder()
                .code(1000)
                .message("Send Mail thành công.")
                .result(emailService.sendEmail(request))
                .build();
    }
    @KafkaListener(topics = "onboard-successful")
    public  void  listen(String message){
        log.info("Message received: {}", message);
    }
}
