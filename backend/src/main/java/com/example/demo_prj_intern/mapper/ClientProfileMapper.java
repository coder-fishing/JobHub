package com.example.demo_prj_intern.mapper;

import com.example.demo_prj_intern.config.MapStructConfig;
import com.example.demo_prj_intern.dto.request.ClientProfileRequest;
import com.example.demo_prj_intern.dto.respone.ClientProfileResponse;
import com.example.demo_prj_intern.entity.ClientProfileEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapStructConfig.class)
public interface ClientProfileMapper {

    ClientProfileResponse toResponse(ClientProfileEntity entity);

    void updateEntityFromRequest(ClientProfileRequest request, @MappingTarget ClientProfileEntity entity);
}
