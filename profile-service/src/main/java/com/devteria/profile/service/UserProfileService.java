package com.devteria.profile.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devteria.profile.dto.userProfile.SearchUserRequest;
import com.devteria.profile.dto.userProfile.UpdateProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileResponse;
import com.devteria.profile.entity.Follows;
import com.devteria.profile.entity.UserProfile;
import com.devteria.profile.exception.AppException;
import com.devteria.profile.exception.ErrorCode;
import com.devteria.profile.mapper.UserProfileMapper;
import com.devteria.profile.repository.UserProfileRepository;
import com.devteria.profile.repository.httpClient.FileClient;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;
    FileClient fileClient;
    HttpServletRequest request;

    public UserProfileResponse createProfile(UserProfileRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);

        userProfile = userProfileRepository.save(userProfile);
        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getByUserId(String userId) {
        //        log.info("userId {}", userId);
        UserProfile userProfile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return toResponsePopulated(userProfile);
    }

    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile =
                userProfileRepository.findById(id).orElseThrow(() -> new RuntimeException("Profile not found"));
        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> getAllProfiles() {
        var profiles = userProfileRepository.findAll();

        return profiles.stream().map(userProfileMapper::toUserProfileResponse).toList();
    }

    public UserProfileResponse getMyProfile() {
        String userId = request.getHeader("X-User-Id");
        log.info("userId, {}", userId);
        var profile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return toResponsePopulated(profile);
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request) {
        String userId = this.request.getHeader("X-User-Id");

        var profile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userProfileMapper.update(profile, request);

        return userProfileMapper.toUserProfileResponse(userProfileRepository.save(profile));
    }

    public UserProfileResponse updateAvatar(MultipartFile file) {
        String userId = request.getHeader("X-User-Id");

        var profile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));

        // update file- invoke an api fileService
        var response = fileClient.uploadMedia(file);
        profile.setAvatar(response.getResult().getUrl());

        return userProfileMapper.toUserProfileResponse(userProfileRepository.save(profile));
    }

    public List<UserProfileResponse> search(SearchUserRequest request) {
        var userId = this.request.getHeader("X-User-Id");
        List<UserProfile> userProfiles =
                userProfileRepository.searchByFirstNameOrLastName("(?i).*" + request.getKeyword() + ".*");
        return userProfiles.stream()
                .filter(userProfile -> !userId.equals(userProfile.getUserId()))
                .map(this::toResponsePopulated)
                .toList();
    }

    public void follow(String userId) {
        String currentUserId = request.getHeader("X-User-Id");

        var myProfile = userProfileRepository
                .findByUserId(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        var targetProfile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (myProfile.getFollowing() == null) myProfile.setFollowing(new HashSet<>());

        Follows follows = Follows.builder()
                .target(targetProfile)
                .followedAt(LocalDateTime.now())
                .build();

        myProfile.getFollowing().add(follows);
        userProfileRepository.save(myProfile);
    }

    public void unfollow(String userId) {
        String currentUserId = request.getHeader("X-User-Id");

        var myProfile = userProfileRepository
                .findByUserId(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (myProfile.getFollowing() != null) {
            myProfile
                    .getFollowing()
                    .removeIf(follows -> follows.getTarget().getUserId().equals(userId));
            userProfileRepository.save(myProfile);
        }
    }

    private UserProfileResponse toResponsePopulated(UserProfile profile) {
        var response = userProfileMapper.toUserProfileResponse(profile);
        String currentUserId = request.getHeader("X-User-Id");

        response.setFollowersCount(userProfileRepository.countFollowers(profile.getUserId()));
        response.setFollowingCount(userProfileRepository.countFollowing(profile.getUserId()));
        response.setIsFollowing(userProfileRepository.isFollowing(currentUserId, profile.getUserId()));

        return response;
    }
}
