package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;


public interface ProjectService {
    ProjectResponse createProject(Long clientId, CreateProjectRequest request, MultipartFile attachment);

    ProjectResponse getProjectById(Long projectId);

    List<ProjectResponse> getAllProjects();

    List<ProjectResponse> getAllOpenProjects();

    // List project of one client
    List<ProjectResponse> getProjectsByClientId(Long clientId);

    // Update project info (title, description, budget, extend deadline, change status)
    ProjectResponse updateProject(Long clientId, Long projectId, UpdateProjectRequest request);

    // tìm kiếm theo ngân sách danh mục
    Page<ProjectResponse> searchProjects(
            String keyword,
            List<String> statuses,
            BigDecimal maxBudget,
            String skill,
            String sortBy,
            int page,
            int size
    );

}
