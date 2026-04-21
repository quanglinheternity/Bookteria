package com.devteria.profile.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.devteria.profile.dto.userProfile.UpdateProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileResponse;
import com.devteria.profile.entity.UserProfile;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserProfileMapper {
    UserProfile toUserProfile(UserProfileRequest request);

    @Mapping(target = "followersCount", ignore = true)
    @Mapping(target = "followingCount", ignore = true)
    @Mapping(target = "postsCount", ignore = true)
    @Mapping(target = "isFollowing", ignore = true)
    UserProfileResponse toUserProfileResponse(UserProfile entity);

    @Mapping(target = "username", source = "userName")
    void update(@MappingTarget UserProfile entity, UpdateProfileRequest request);
}
