package com.devteria.identity.mapper;

import org.mapstruct.Mapper;

import com.devteria.identity.dto.request.UserCreationRequest;
import com.devteria.identity.dto.request.UserProfileRequest;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    UserProfileRequest toUserProfileRequest(UserCreationRequest request);
}
