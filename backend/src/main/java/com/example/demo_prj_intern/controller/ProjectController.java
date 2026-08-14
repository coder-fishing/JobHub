package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectFilterStatsResponse;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;
import com.example.demo_prj_intern.service.ProjectService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final com.example.demo_prj_intern.service.AuthService authService;

    // 1. Tạo mới dự án
    // URL: POST http://localhost:8080/api/project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody CreateProjectRequest request) {
        com.example.demo_prj_intern.dto.respone.CurrentUserResponse currentUser = authService.getCurrentUser();
        if (!"CLIENT".equals(currentUser.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Chỉ CLIENT mới được tạo dự án");
        }
        ProjectResponse response = projectService.createProject(currentUser.getId(), request);
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
            @RequestParam(defaultValue = "5") int size
    ) {
        // 🟢 Nếu gửi lên chuỗi skill (ví dụ: "Spring"), lấy từ khóa đó để query LIKE
        String skillToSearch = null;
        if (skills != null && !skills.isBlank()) {
            // Lấy từ khóa skill cuối cùng trong danh sách (chính là skill vừa nhập/chọn)
            String[] skillArray = skills.split(",");
            skillToSearch = skillArray[skillArray.length - 1].trim();
        }

        Page<ProjectResponse> result = projectService.searchProjects(
                keyword, status, maxBudget, skillToSearch, sortBy, page, size
        );
        return ResponseEntity.ok(result);
    }

// thống kê số lượng theo status và skills
    @GetMapping("/stats")
    public ResponseEntity<ProjectFilterStatsResponse> getFilterStats() {
        return ResponseEntity.ok(projectService.getFilterStats());
    }
}
