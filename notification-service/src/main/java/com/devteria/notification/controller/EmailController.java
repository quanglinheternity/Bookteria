package com.devteria.notification.controller;

import com.devteria.notification.dto.ApiResponse;
import com.devteria.notification.dto.Email.EmailResponse;
import com.devteria.notification.dto.Email.SendEmailRequest;
import com.devteria.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
}
