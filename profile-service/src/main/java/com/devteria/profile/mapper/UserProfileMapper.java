package com.devteria.profile.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.devteria.profile.dto.userProfile.UpdateProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileResponse;
import com.devteria.profile.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(UserProfileRequest request);

    UserProfileResponse toUserProfileResponse(UserProfile entity);

    void update(@MappingTarget UserProfile entity, UpdateProfileRequest request);
}
