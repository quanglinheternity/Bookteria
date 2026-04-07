package com.devteria.profile.dto.userProfile;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String userId;
    String firstName;
    String lastName;
    String userName;
    String email;
    String avatar;
    LocalDate dob;
    String city;
}
