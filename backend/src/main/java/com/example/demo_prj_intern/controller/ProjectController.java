package com.example.demo_prj_intern.controller;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;
import com.example.demo_prj_intern.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 1. Tạo mới dự án
    // URL: POST http://localhost:8080/api/project?clientId=1
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestBody CreateProjectRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        ProjectResponse response = projectService.createProject(clientId, request);
        return ResponseEntity.ok(response);
    }

    // 2. Lấy thông tin chi tiết của dự án theo ID
    // URL: GET http://localhost:8080/api/project/1
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable("projectId") Long projectId) {
        ProjectResponse response = projectService.getProjectById(projectId);
        return ResponseEntity.ok(response);
    }

    // 3. Lấy danh sách dự án (có thể lọc theo clientId hoặc trạng thái OPEN)
    // URL Lấy tất cả: GET http://localhost:8080/api/project
    // URL Lấy theo client: GET http://localhost:8080/api/project?clientId=1
    // URL Lấy các dự án OPEN: GET http://localhost:8080/api/project?status=OPEN
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestParam(value = "status", required = false) String status) {
        
        if (clientId != null) {
            return ResponseEntity.ok(projectService.getProjectsByClientId(clientId));
        } else if ("OPEN".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(projectService.getAllOpenProjects());
        } else {
            return ResponseEntity.ok(projectService.getAllProjects());
        }
    }

    // 4. Cập nhật thông tin dự án (Chỉnh sửa thông tin, gia hạn hạn chót, đổi trạng thái tuyển dụng, đóng/hủy dự án)
    // URL: PUT http://localhost:8080/api/project/1?clientId=1
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable("projectId") Long projectId,
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestBody UpdateProjectRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID là tham số bắt buộc trong URL (Ví dụ: ?clientId=1)");
        }
        ProjectResponse response = projectService.updateProject(clientId, projectId, request);
        return ResponseEntity.ok(response);
    }
}
