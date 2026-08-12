package com.example.demo_prj_intern.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;
import com.example.demo_prj_intern.service.ProjectService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final com.example.demo_prj_intern.service.AuthService authService;

    // 1. Tạo mới dự án
    // URL: POST http://localhost:8080/api/project
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponse> createProject(
            @ModelAttribute CreateProjectRequest request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được tạo dự án");
        }
        ProjectResponse response = projectService.createProject(currentUser.getId(), request, attachment);
        return ResponseEntity.ok(response);
    }

    // 2. Lấy thông tin chi tiết của dự án theo ID
    // URL: GET http://localhost:8080/api/project/1
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable("projectId") Long projectId) {
        ProjectResponse response = projectService.getProjectById(projectId);
        return ResponseEntity.ok(response);
    }

    // 3. Lấy danh sách dự án
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "myProjects", required = false, defaultValue = "false") boolean myProjects) {
        
        if (myProjects) {
            com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(projectService.getProjectsByClientId(currentUser.getId()));
        } else if (clientId != null) {
            return ResponseEntity.ok(projectService.getProjectsByClientId(clientId));
        } else if ("OPEN".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(projectService.getAllOpenProjects());
        } else {
            return ResponseEntity.ok(projectService.getAllProjects());
        }
    }

    // 4. Cập nhật thông tin dự án
    // URL: PUT http://localhost:8080/api/project/1
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable("projectId") Long projectId,
            @RequestBody UpdateProjectRequest request) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được cập nhật dự án");
        }
        ProjectResponse response = projectService.updateProject(currentUser.getId(), projectId, request);
        return ResponseEntity.ok(response);
    }


    // 5. tìm kiếm thông tin theo danh mục, ngân sách
  @GetMapping("/search")
public ResponseEntity<Page<ProjectResponse>> searchProjects(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) List<String> status,
        @RequestParam(required = false) BigDecimal maxBudget,
        @RequestParam(required = false) String skills,
        @RequestParam(defaultValue = "newest") String sortBy,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size
) {
    String skill = (skills != null && !skills.isBlank())
            ? skills.split(",")[0].trim()
            : null;

    Page<ProjectResponse> result = projectService.searchProjects(
            keyword, status, maxBudget, skill, sortBy, page, size
    );
    return ResponseEntity.ok(result);
}
}
