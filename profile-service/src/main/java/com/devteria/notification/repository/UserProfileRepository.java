package com.devteria.notification.repository;

import com.devteria.notification.dto.userProfile.UserProfileResponse;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import com.devteria.notification.entity.UserProfile;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    @Query("""
        MATCH (u:user_profile)
        WHERE u.userId = $userId
        RETURN u
        """)
    Optional<UserProfile> findByUserId(String userId);
}
