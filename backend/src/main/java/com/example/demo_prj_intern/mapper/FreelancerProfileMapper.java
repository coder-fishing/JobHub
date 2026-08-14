package com.example.demo_prj_intern.mapper;

import com.example.demo_prj_intern.config.MapStructConfig;
import com.example.demo_prj_intern.dto.request.FreelancerRequest;
import com.example.demo_prj_intern.dto.respone.FreelancerProfileRespone;
import com.example.demo_prj_intern.entity.FreelancerProfileEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(config = MapStructConfig.class)
public interface FreelancerProfileMapper {
    // Convert entity to response DTO
    @org.mapstruct.Mapping(source = "user.id", target = "userId")
    @org.mapstruct.Mapping(source = "user.email", target = "email")
    FreelancerProfileRespone toResponse(FreelancerProfileEntity entity);

    // 2. Chuyển List Entity sang List Response DTO (Xem danh sách tất cả Freelancers)
    List<FreelancerProfileRespone> toResponseList(List<FreelancerProfileEntity> entities);

    // 3. Cập nhật dữ liệu từ Request DTO vào Entity có sẵn (Tự động bỏ qua null và tự động .trim() String)
    void updateEntityFromRequest(FreelancerRequest request, @MappingTarget FreelancerProfileEntity entity);


}
