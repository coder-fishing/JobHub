package com.example.demo_prj_intern.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserResponse {
    private Long id;
    private String email;
    private String role;
    private String status;
    private boolean profileCompleted;
}
