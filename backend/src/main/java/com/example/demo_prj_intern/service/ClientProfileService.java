package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.ClientProfileRequest;
import com.example.demo_prj_intern.dto.respone.ClientJobHistoryDTO;
import com.example.demo_prj_intern.dto.respone.ClientProfileResponse;

import java.util.List;

public interface ClientProfileService {

    ClientProfileResponse getClientProfileByUserId(Long userId);

    ClientProfileResponse updateClientProfile(Long userId, ClientProfileRequest request);

    List<ClientJobHistoryDTO> getClientJobHistory(Long userId);
}
