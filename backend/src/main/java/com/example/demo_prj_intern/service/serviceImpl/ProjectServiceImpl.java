package com.example.demo_prj_intern.service.serviceImpl;

import com.example.demo_prj_intern.dto.request.CreateProjectRequest;
import com.example.demo_prj_intern.dto.request.UpdateProjectRequest;
import com.example.demo_prj_intern.dto.respone.ProjectFilterStatsResponse;
import com.example.demo_prj_intern.dto.respone.ProjectResponse;
import com.example.demo_prj_intern.entity.ProjectEntity;
import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.ProjectRepository;
import com.example.demo_prj_intern.repository.UserRepository;
import com.example.demo_prj_intern.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// tìm  kiếm dự án bởi freelancer
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ProjectResponse createProject(Long clientId, CreateProjectRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID must not be null");
        }
        if (request == null) {
            throw new IllegalArgumentException("Request body must not be null");
        }

        // Validate project input fields
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Project title is required");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Project description is required");
        }
        if (request.getBudget() == null || request.getBudget().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Project budget must be greater than zero");
        }
        if (request.getDeadline() == null || request.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Project deadline must be in the future");
        }

        // Check if client exists
        UserEntity client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));

        // Validate client role and status
        if (!"CLIENT".equalsIgnoreCase(client.getRole())) {
            throw new IllegalArgumentException("Only users with role CLIENT can create projects");
        }
        if (!"ACTIVE".equalsIgnoreCase(client.getStatus())) {
            throw new IllegalArgumentException("User account is not active");
        }

        // Create Project
        ProjectEntity project = new ProjectEntity();
        project.setClient(client);
        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setBudget(request.getBudget());
        project.setDeadline(LocalDateTime.from(request.getDeadline().atStartOfDay(ZoneId.systemDefault())));
        if (request.getMaxFreelancers() != null && request.getMaxFreelancers() > 0) {
            project.setMaxFreelancers(request.getMaxFreelancers());
        } else {
            project.setMaxFreelancers(1);
        }
        project.setStatus("OPEN"); // Mặc định khi vừa đăng là OPEN

        // Lưu xuống database
        ProjectEntity savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    @Override
    public ProjectResponse getProjectById(Long projectId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án với ID: " + projectId));
        return mapToResponse(project);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getAllOpenProjects() {
        // Lấy các dự án có status = 'OPEN' trực tiếp từ database bằng query, không tải toàn bộ và filter trên RAM
        return projectRepository.findByStatus("OPEN", Pageable.unpaged()).getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getProjectsByClientId(Long clientId) {
        if (!userRepository.existsById(clientId)) {
            throw new RuntimeException("Không tìm thấy khách hàng với ID: " + clientId);
        }
        return projectRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long clientId, Long projectId, UpdateProjectRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID must not be null");
        }
        if (projectId == null) {
            throw new IllegalArgumentException("Project ID must not be null");
        }
        if (request == null) {
            throw new IllegalArgumentException("Request body must not be null");
        }

        // Tìm dự án
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án với ID: " + projectId));

        // Kiểm tra quyền sở hữu dự án
        if (project.getClient() == null || !clientId.equals(project.getClient().getId())) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa dự án này");
        }

        // Kiểm tra tài khoản client còn hoạt động không
        UserEntity client = project.getClient();
        if (!"ACTIVE".equalsIgnoreCase(client.getStatus())) {
            throw new IllegalArgumentException("Tài khoản của bạn đã bị khóa hoặc không hoạt động");
        }

        // Cập nhật các trường thông tin nếu được truyền vào
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            project.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
            project.setDescription(request.getDescription().trim());
        }

        if (request.getBudget() != null) {
            if (request.getBudget().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Ngân sách dự án phải lớn hơn 0");
            }
            project.setBudget(request.getBudget());
        }

        if (request.getDeadline() != null) {
            if (request.getDeadline().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Hạn chót dự án không được nằm trong quá khứ");
            }
            project.setDeadline(LocalDateTime.from(request.getDeadline().atStartOfDay(ZoneId.systemDefault())));
        }

        if (request.getMaxFreelancers() != null) {
            if (request.getMaxFreelancers() <= 0) {
                throw new IllegalArgumentException("Số lượng freelancer cần tuyển phải lớn hơn 0");
            }
            project.setMaxFreelancers(request.getMaxFreelancers());
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            String newStatus = request.getStatus().trim().toUpperCase();
            // Xác thực trạng thái hợp lệ
            if (!List.of("OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED").contains(newStatus)) {
                throw new IllegalArgumentException("Trạng thái dự án không hợp lệ (Chỉ chấp nhận: OPEN, IN_PROGRESS, COMPLETED, CANCELLED)");
            }
            project.setStatus(newStatus);
        }

        ProjectEntity savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }
  @Override
public Page<ProjectResponse> searchProjects(
        String keyword,
        List<String> statuses,
        BigDecimal maxBudget,
        String skill,
        String sortBy,
        int page,
        int size
) {
    // Xử lý sắp xếp
    Sort sort = switch (sortBy == null ? "newest" : sortBy.toLowerCase()) {
        case "budget_high" -> Sort.by(Sort.Direction.DESC, "budget");
        case "budget_low"  -> Sort.by(Sort.Direction.ASC, "budget");
        default            -> Sort.by(Sort.Direction.DESC, "createdAt");
    };

    Pageable pageable = PageRequest.of(page, size, sort);

    // Nếu statuses rỗng → null (không lọc status)
    List<String> statusList = (statuses == null || statuses.isEmpty()) ? null : statuses;

    // Gọi repository
    Page<ProjectEntity> projectPage = projectRepository.searchProjects(
            keyword,
            statusList,
            maxBudget,
            skill,
            pageable
    );

    return projectPage.map(this::mapToResponse);
}
    // === HÀM CONVERT ENTITY -> RESPONSE DTO ===
    private ProjectResponse mapToResponse(ProjectEntity entity) {
        ProjectResponse response = new ProjectResponse();
        response.setId(entity.getId());
        if (entity.getClient() != null) {
            response.setClientId(entity.getClient().getId());
            response.setClientEmail(entity.getClient().getEmail());
        }
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setBudget(entity.getBudget());
        // ProjectEntity không có trường requirements/requiredSkills, do đó đặt mặc định là null hoặc từ request nếu cần (nhưng mapToResponse chỉ có entity)
        response.setRequiredSkills(entity.getRequiredSkills());
        response.setMaxFreelancers(entity.getMaxFreelancers() != null ? entity.getMaxFreelancers() : 1);
        response.setStatus(entity.getStatus());
        if (entity.getDeadline() != null) {
            response.setDeadline(entity.getDeadline().toLocalDate());
        }
        response.setCreatedAt(entity.getCreatedAt());
        return response;
    }
    // =================================================================
    // ★ CHỨC NĂNG MỚI: TÌM KIẾM + LỌC DỰ ÁN (dùng cho trang /jobs)
    // =================================================================
    /**
     * Tìm kiếm và lọc dự án theo keyword, status, budget, skill.
     * Không thay đổi các method cũ.
     */
    
    @Override
public ProjectFilterStatsResponse getFilterStats() {
    // 1. Đếm theo Status (Trạng thái)
    List<Object[]> statusResults = projectRepository.countProjectsByStatus();
    Map<String, Long> statusCounts = new HashMap<>();
    for (Object[] result : statusResults) {
        String status = (String) result[0];
        Long count = (Long) result[1];
        if (status != null) {
            statusCounts.put(status, count);
        }
    }

    // 2. Đếm theo từng Skill (Kỹ năng)
    List<String> allSkillsList = projectRepository.findAllRequiredSkills();
    Map<String, Long> skillCounts = new HashMap<>();

    for (String skillString : allSkillsList) {
        if (skillString != null && !skillString.trim().isEmpty()) {
            String[] skills = skillString.split(",");
            for (String skill : skills) {
                String cleanSkill = skill.trim();
                if (!cleanSkill.isEmpty()) {
                    skillCounts.put(cleanSkill, skillCounts.getOrDefault(cleanSkill, 0L) + 1);
                }
            }
        }
    }

    // 3. Trả về Response DTO
    return ProjectFilterStatsResponse.builder()
            .statusCounts(statusCounts)
            .skillCounts(skillCounts)
            .totalProjects(projectRepository.count())
            .build();
}
    
}
