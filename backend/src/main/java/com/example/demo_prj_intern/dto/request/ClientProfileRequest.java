package com.example.demo_prj_intern.dto.request;

import lombok.Data;

@Data
public class ClientProfileRequest {
    private String companyName;
    private String companyWebsite;
    private String industry;
    private String companySize;
    private String bio;
    private String location;
    private String avatarUrl;
    private String taxCode;
}
