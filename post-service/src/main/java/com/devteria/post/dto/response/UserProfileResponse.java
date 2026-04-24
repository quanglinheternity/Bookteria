package com.devteria.post.dto.response;

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
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
    String avatar;
    String bio;
    String level;
    String userId;
    long followersCount;
    long followingCount;
    long postsCount;

    Boolean isFollowing;
}
