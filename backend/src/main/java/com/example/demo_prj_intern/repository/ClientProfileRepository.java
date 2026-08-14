package com.example.demo_prj_intern.repository;

import com.example.demo_prj_intern.entity.ClientProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfileEntity, Long> {

    Optional<ClientProfileEntity> findByUserId(Long userId);
}
