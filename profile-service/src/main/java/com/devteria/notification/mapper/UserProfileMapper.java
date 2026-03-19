package com.devteria.notification.mapper;

import org.mapstruct.Mapper;

import com.devteria.notification.dto.userProfile.UserProfileRequest;
import com.devteria.notification.dto.userProfile.UserProfileResponse;
import com.devteria.notification.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(UserProfileRequest request);

    UserProfileResponse toUserProfileResponse(UserProfile entity);
}
