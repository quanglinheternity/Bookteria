package com.devteria.profile.controller.userProfile;

import com.devteria.profile.dto.userProfile.UserProfileRequest;
import com.devteria.profile.dto.userProfile.UserProfileResponse;
import com.devteria.profile.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/initial/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InitialUserProfileController {
    UserProfileService userProfileService;

    @PostMapping("/create")
    UserProfileResponse creatProfile(@RequestBody UserProfileRequest request) {
        return userProfileService.createProfile(request);
    }


}
