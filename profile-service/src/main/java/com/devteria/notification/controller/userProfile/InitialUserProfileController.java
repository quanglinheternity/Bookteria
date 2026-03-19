package com.devteria.notification.controller.userProfile;

import com.devteria.notification.dto.userProfile.UserProfileRequest;
import com.devteria.notification.dto.userProfile.UserProfileResponse;
import com.devteria.notification.service.UserProfileService;
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
