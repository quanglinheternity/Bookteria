package com.devteria.profile.dto.userProfile;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String username;
    String firstName;
    String lastName;

    String avatar;
    String bio;
    String level;

    long followersCount;
    long followingCount;
    long postsCount;

    Boolean isFollowing;
}
