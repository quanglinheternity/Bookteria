package com.devteria.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import com.devteria.profile.entity.UserProfile;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    @Query("""
		MATCH (u:user_profile)
		WHERE u.userId = $userId
		RETURN u
		""")
    Optional<UserProfile> findByUserId(String userId);

    List<UserProfile> findAllByUsernameLike(String username);

    @Query("MATCH (u:user_profile) WHERE u.firstName =~ $keyword OR u.lastName =~ $keyword RETURN u")
    List<UserProfile> searchByFirstNameOrLastName(String keyword);

    @Query("MATCH (u:user_profile {userId: $userId})<-[r:FOLLOWS]-(follower) RETURN count(elementId(r))")
    long countFollowers(String userId);

    @Query("MATCH (u:user_profile {userId: $userId})-[r:FOLLOWS]->(following) RETURN count(elementId(r))")
    long countFollowing(String userId);

    @Query(
            "MATCH (u1:user_profile {userId: $currentUserId})-[r:FOLLOWS]->(u2:user_profile {userId: $targetUserId}) RETURN count(elementId(r)) > 0")
    boolean isFollowing(String currentUserId, String targetUserId);
}
