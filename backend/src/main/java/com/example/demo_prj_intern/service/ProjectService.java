package com.example.demo_prj_intern.service;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(Long clientId, CreateProjectRequest request);

    ProjectResponse getProjectById(Long projectId);

    List<ProjectResponse> getAllProjects();

    List<ProjectResponse> getAllOpenProjects();

    // List project of one client
    List<ProjectResponse> getProjectsByClientId(Long clientId);

    // Update project info (title, description, budget, extend deadline, change status)
    ProjectResponse updateProject(Long clientId, Long projectId, UpdateProjectRequest request);
}
