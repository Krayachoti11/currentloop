package com.currentloop.backend.repository;

import com.currentloop.backend.model.SuspiciousActivityFlag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface SuspiciousActivityFlagRepository extends JpaRepository<SuspiciousActivityFlag, Long> {
    boolean existsByUserIdAndTypeAndCreatedAtAfter(Long userId, String type, LocalDateTime createdAt);
}
