package com.devteria.profile.controller.userProfile;

import org.springframework.web.bind.annotation.*;

import com.devteria.profile.dto.userProfile.UserProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileResponse;
import com.devteria.profile.service.UserProfileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileController {
    UserProfileService userProfileService;

    @PostMapping("/create")
    UserProfileResponse creatProfile(@RequestBody UserProfileRequest request) {
        return userProfileService.createProfile(request);
    }

    @GetMapping("/{id}/detail")
    UserProfileResponse getDetailProfile(@PathVariable String id) {
        return userProfileService.getProfile(id);
    }
}
