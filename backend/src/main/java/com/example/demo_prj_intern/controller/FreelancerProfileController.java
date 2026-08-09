package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone;
import com.example.demo_prj_intern.service.FreelancerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/freelancer/profile")
@RequiredArgsConstructor
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;

    @GetMapping("/{userId}")
    public ResponseEntity<FreelancerProfileRespone> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(freelancerProfileService.getProfileByUserId(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<FreelancerProfileRespone> updateProfile(
            @PathVariable Long userId,
            @RequestBody FreelancerRequest request
    ) {
        return ResponseEntity.ok(freelancerProfileService.updateProfile(userId, request));
    }
}
