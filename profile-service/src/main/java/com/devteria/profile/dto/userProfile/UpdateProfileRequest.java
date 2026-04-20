package com.devteria.profile.dto.userProfile;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateProfileRequest {
    String email;
    String userName;
    String firstName;
    String lastName;
    String bio;
    String city;
    String level;
}
