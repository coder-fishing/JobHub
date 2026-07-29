package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone;

public interface FreelancerProfileService {

    FreelancerProfileRespone getProfileByUserId (Long userId);

    FreelancerProfileRespone updateProfile(Long userId, FreelancerRequest request);

}