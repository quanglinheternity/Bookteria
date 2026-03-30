<<<<<<<< HEAD:profile-service/src/main/java/com/devteria/notification/dto/userProfile/UserProfileResponse.java
package com.devteria.notification.dto.userProfile;

import java.time.LocalDate;
========
package com.devteria.post.dto.response;
>>>>>>>> quanglinh/post-service:post-service/src/main/java/com/devteria/post/dto/response/UserProfileResponse.java

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
