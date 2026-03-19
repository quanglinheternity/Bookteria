package com.devteria.notification.dto.userProfile;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileRequest {
    String userId;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
